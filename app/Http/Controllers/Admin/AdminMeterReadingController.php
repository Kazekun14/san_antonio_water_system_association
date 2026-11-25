<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\MeterReadingImport;
use App\Imports\MeterReadingImportValidationException;
use App\Models\Bill;
use App\Models\Customer;
use App\Models\MeterReading;
use App\Models\User;
use App\Notifications\AdminNotification;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class AdminMeterReadingController extends Controller
{
    public function index(Request $request)
    {
        // ---- Server-side filters (all optional, combined with AND) ----
        // Each filter is sanitized so malformed query parameters can never
        // reach the SQL builder. Empty values are treated as "no filter".
        $meterReaderId = $request->filled('meter_reader_id') && $request->integer('meter_reader_id') > 0
            ? $request->integer('meter_reader_id')
            : null;

        $customerId = $request->filled('customer_id') && $request->integer('customer_id') > 0
            ? $request->integer('customer_id')
            : null;

        // Reading Date range — both boundaries are inclusive (whereDate with
        // >= / <= on a date column keeps the boundary days themselves).
        $dateFrom = is_string($request->input('date_from')) ? $request->input('date_from') : null;
        $dateTo = is_string($request->input('date_to')) ? $request->input('date_to') : null;
        $dateFrom = $dateFrom && preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateFrom) ? $dateFrom : null;
        $dateTo = $dateTo && preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateTo) ? $dateTo : null;

        $readings = MeterReading::with(['customer', 'meterReader', 'recorder'])
            ->when($meterReaderId, fn ($q) => $q->where('meter_reader_id', $meterReaderId))
            ->when($customerId, fn ($q) => $q->where('customer_id', $customerId))
            ->when($dateFrom, fn ($q) => $q->whereDate('reading_date', '>=', $dateFrom))
            ->when($dateTo, fn ($q) => $q->whereDate('reading_date', '<=', $dateTo))
            ->where('status', 'pending')
            ->orderBy('reading_date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(5)
            ->withQueryString();

        // Attach derived display fields (previous_reading, consumption, bill_id)
        MeterReading::decorate($readings);

        // Eligible meter readers: admins (who may also act as readers) plus
        // staff with the meter_reader position. Encoders are excluded — this
        // reuses the same User::recorders() scope as the create/import forms.
        $meterReaders = User::recorders()->orderBy('username')->get(['id', 'username']);

        // Keep the currently filtered reader in the list even if they have since
        // been demoted, so an applied filter stays visible in the dropdown and
        // its chip (mirrors the edit() form behavior).
        if ($meterReaderId && ! $meterReaders->contains('id', $meterReaderId)) {
            $current = User::find($meterReaderId, ['id', 'username']);
            if ($current) {
                $meterReaders->prepend($current);
            }
        }

        // Full customer list powers the searchable Customer filter combobox.
        $customers = Customer::orderBy('first_name')
            ->get(['id', 'first_name', 'last_name', 'purok', 'meter_number']);

        return Inertia::render('admin/meter-readings/index', [
            'readings' => $readings,
            'meterReaders' => $meterReaders,
            'customers' => $customers,
            // Echo the applied filters back so the UI can render the active
            // selections/chips and keep them across pagination (the paginator
            // above already preserves them in the query string).
            'filters' => [
                'meter_reader_id' => $meterReaderId,
                'customer_id' => $customerId,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    public function create()
    {
        $customers = Customer::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'purok', 'meter_number', 'initial_reading']);

        // Most recently recorded reading per customer (latest by reading date),
        // falling back to the initial reading (or 0) so the form can prefill /
        // display a baseline. Mirrors the previous-reading lookup in store().
        $lastReadings = MeterReading::orderBy('reading_date', 'desc')
            ->orderBy('id', 'desc')
            ->get(['customer_id', 'meter_reading'])
            ->unique('customer_id')
            ->pluck('meter_reading', 'customer_id');

        $previousReadings = $customers->mapWithKeys(fn ($c) => [
            $c->id => (string) ($lastReadings[$c->id] ?? $c->initial_reading ?? 0),
        ]);

        // Latest recorded reading date per customer, used to restrict the
        // Reading Date picker (no date before a customer's last reading is
        // allowed). Customers without any previous reading have no entry —
        // only "today" (the max) applies for them.
        $latestReadingDates = MeterReading::orderBy('reading_date', 'desc')
            ->orderBy('id', 'desc')
            ->get(['customer_id', 'reading_date'])
            ->unique('customer_id')
            ->mapWithKeys(fn ($r) => [$r->customer_id => $r->reading_date->toDateString()]);

        $meterReaders = User::recorders()->orderBy('username')->get(['id', 'username']);

        return Inertia::render('admin/meter-readings/create', [
            'customers' => $customers,
            'previousReadings' => $previousReadings,
            'latestReadingDates' => $latestReadingDates,
            'meterReaders' => $meterReaders,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'meter_reader_id' => ['required', Rule::exists('users', 'id')->where(function ($q) {
                // Admins may also act as meter readers.
                $q->where('role', 'admin')
                    ->orWhere(fn ($qq) => $qq->where('role', 'staff')->where('position', 'meter_reader'));
            })],
            'meter_reading' => ['required', 'numeric', 'min:0'],
            'reading_date' => ['required', 'date', 'before_or_equal:today'],
        ]);

        $customer = Customer::findOrFail($request->customer_id);

        // Previous reading comes from the customer's last recorded reading,
        // falling back to the initial reading (or 0 for new connections).
        $lastReading = MeterReading::where('customer_id', $customer->id)
            ->orderByDesc('reading_date')
            ->orderByDesc('id')
            ->first();

        $previousReading = $lastReading
            ? (float) $lastReading->meter_reading
            : (float) ($customer->initial_reading ?? 0);

        // The reading date must be after the customer's latest recorded reading
        // — the latest reading date itself is already taken (duplicate check
        // below), so anything on or before it is rejected. Future dates are
        // already rejected by the before_or_equal:today rule.
        if ($lastReading && Carbon::parse($request->reading_date)->lte($lastReading->reading_date)) {
            return back()->withErrors([
                'reading_date' => "The reading date must be after the customer's latest recorded reading date ({$lastReading->reading_date->toDateString()}).",
            ])->withInput();
        }

        $currentReading = (float) $request->meter_reading;

        if ($currentReading < $previousReading) {
            return back()->withErrors([
                'meter_reading' => "Meter reading ({$currentReading}) cannot be less than the previous reading ({$previousReading}).",
            ])->withInput();
        }

        // One reading per customer per date — prevent duplicates.
        if (MeterReading::where('customer_id', $customer->id)
            ->whereDate('reading_date', $request->reading_date)
            ->exists()) {
            return back()->withErrors([
                'reading_date' => 'A meter reading already exists for this customer on the selected date.',
            ])->withInput();
        }

        MeterReading::create([
            'customer_id' => $customer->id,
            'meter_reader_id' => $request->meter_reader_id,
            'recorded_by_user_id' => Auth::id(),
            'meter_reading' => $currentReading,
            'reading_date' => $request->reading_date,
        ]);

        // Notify Admins and Staff about the new reading. Billing is handled
        // separately — recording a reading does not generate a bill.
        $adminsAndStaff = User::whereIn('role', ['admin', 'staff'])->get();
        $adminNotify = new AdminNotification(
            'billing',
            'New Meter Reading Recorded',
            'A meter reading was recorded for '.($customer->first_name ?? 'a customer').'.',
            ['reading_date' => $request->reading_date]
        );
        foreach ($adminsAndStaff as $recipient) {
            $recipient->notify($adminNotify);
        }

        return redirect()->route('admin.meter-readings.index')
            ->with('success', 'Meter reading recorded successfully.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt,xls,xlsx',
            'meter_reader_id' => ['required', Rule::exists('users', 'id')->where(function ($q) {
                // Admins may also act as meter readers.
                $q->where('role', 'admin')
                    ->orWhere(fn ($qq) => $qq->where('role', 'staff')->where('position', 'meter_reader'));
            })],
            'reading_date' => ['required', 'date', 'before_or_equal:today'],
        ], [
            'file.required' => 'Please choose an Excel file to import.',
            'file.mimes' => 'The file must be an Excel or CSV file (.xlsx, .xls, .csv, .txt).',
            'meter_reader_id.required' => 'Please select a Meter Reader before importing the file.',
            'reading_date.required' => 'Please select a Reading Date before importing the file.',
            'reading_date.date' => 'The Reading Date must be a valid date.',
            'reading_date.before_or_equal' => 'The Reading Date cannot be in the future.',
        ]);

        try {
            $import = new MeterReadingImport($request->meter_reader_id, $request->reading_date);

            Excel::import($import, $request->file('file'));

            // Notify Admins and Staff only when readings were actually created
            // — an import where every row was a duplicate produced nothing new.
            if ($import->importedCount > 0) {
                $adminsAndStaff = User::whereIn('role', ['admin', 'staff'])->get();
                $batchNotify = new AdminNotification(
                    'billing',
                    'Batch Meter Readings Imported',
                    'A batch of meter readings has been imported successfully.',
                    ['import_date' => now()]
                );
                foreach ($adminsAndStaff as $recipient) {
                    $recipient->notify($batchNotify);
                }
            }

            return redirect()->route('admin.meter-readings.index')
                ->with('success', $import->summaryMessage());
        } catch (MeterReadingImportValidationException $e) {
            // One or more rows failed validation — no records were imported.
            return redirect()->route('admin.meter-readings.index')
                ->with('error', $e->errors());
        } catch (\PhpOffice\PhpSpreadsheet\Reader\Exception $e) {
            // The extension looked fine but the content could not be parsed.
            return redirect()->route('admin.meter-readings.index')
                ->with('error', 'The uploaded file is not a valid Excel or CSV file. Please download the template and save it as .xlsx, .xls, .csv or .txt before importing.');
        } catch (QueryException $e) {
            // The only integrity constraint the import can trip is the
            // (customer_id, reading_date) unique index — e.g. a concurrent
            // import slipped a duplicate past the checks. The transaction was
            // rolled back, so nothing to clean up.
            return redirect()->route('admin.meter-readings.index')
                ->with('error', 'The import was rolled back because a duplicate meter reading was detected. No readings or bills were saved.');
        } catch (\Exception $e) {
            return redirect()->route('admin.meter-readings.index')
                ->with('error', $e->getMessage());
        }
    }

    public function downloadTemplate()
    {
        $path = public_path('templates/sawsa_meter_reading_template.xlsx');

        return response()->download($path, 'sawsa_meter_reading_template.xlsx', [
            'Cache-Control' => 'no-store, no-cache, must-revalidate, private',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    /**
     * Reject requests against an approved (locked) reading.
     *
     * Approved readings are confirmed official records: they must not be
     * edited, updated or deleted, even through a direct request. Returns a
     * redirect response when the reading is locked, or null to let the request
     * proceed.
     */
    private function lockedRedirect(MeterReading $reading): ?\Illuminate\Http\RedirectResponse
    {
        if ($reading->status === 'approved') {
            return redirect()->route('admin.meter-readings.index')
                ->with('error', 'This meter reading is approved and locked. It can no longer be edited or deleted.');
        }

        return null;
    }

    public function approve(MeterReading $reading)
    {
        // Only pending readings can be approved — an approved reading is a
        // locked official record and cannot be approved again.
        if ($reading->status === 'approved') {
            return redirect()->route('admin.meter-readings.index')
                ->with('error', 'This meter reading is already approved.');
        }

        $reading->update(['status' => 'approved']);

        return redirect()->route('admin.meter-readings.index')
            ->with('success', 'Meter reading approved successfully.');
    }

    /**
     * Approve several pending readings at once. Only pending readings are
     * touched — approved records are locked and are never changed by the bulk
     * action, even if their ids are submitted directly.
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'integer'],
        ]);

        $count = MeterReading::whereIn('id', $request->ids)
            ->where('status', 'pending')
            ->update(['status' => 'approved']);

        if ($count === 0) {
            return redirect()->route('admin.meter-readings.index')
                ->with('error', 'None of the selected readings can be approved.');
        }

        return redirect()->route('admin.meter-readings.index')
            ->with('success', $count.' meter reading'.($count === 1 ? '' : 's').' approved successfully.');
    }

    /**
     * Delete several pending readings at once. A reading's bill (and its
     * payments) are deleted together so the books stay consistent — mirrors
     * the single delete path. Finalized records are never touched.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'integer'],
        ]);

        $readings = MeterReading::whereIn('id', $request->ids)
            ->where('status', 'pending')
            ->get();

        DB::transaction(function () use ($readings) {
            foreach ($readings as $reading) {
                $bill = Bill::where('customer_id', $reading->customer_id)
                    ->whereDate('billing_date', $reading->reading_date)
                    ->first();

                if ($bill) {
                    $bill->payments()->delete();
                    $bill->delete();
                }

                $reading->delete();
            }
        });

        $count = $readings->count();

        if ($count === 0) {
            return redirect()->route('admin.meter-readings.index')
                ->with('error', 'None of the selected readings can be deleted.');
        }

        return redirect()->route('admin.meter-readings.index')
            ->with('success', $count.' meter reading'.($count === 1 ? '' : 's').' deleted successfully.');
    }

    public function destroy(MeterReading $reading)
    {
        if ($locked = $this->lockedRedirect($reading)) {
            return $locked;
        }

        // A reading's bill (and its payments) are deleted together so the books
        // stay consistent — deleting only the reading would orphan the bill.
        DB::transaction(function () use ($reading) {
            $bill = Bill::where('customer_id', $reading->customer_id)
                ->whereDate('billing_date', $reading->reading_date)
                ->first();

            if ($bill) {
                $bill->payments()->delete();
                $bill->delete();
            }

            $reading->delete();
        });

        return redirect()->route('admin.meter-readings.index')
            ->with('success', 'Meter reading deleted successfully.');
    }

    public function edit(MeterReading $reading)
    {
        if ($locked = $this->lockedRedirect($reading)) {
            return $locked;
        }

        $reading->load('recorder');

        // Only allow editing unbilled readings (a bill exists for the customer on the reading date)
        $billed = Bill::where('customer_id', $reading->customer_id)
            ->whereDate('billing_date', $reading->reading_date)
            ->exists();

        if ($billed) {
            return redirect()->route('admin.meter-readings.index')
                ->with('error', 'This reading already has a bill generated and cannot be edited.');
        }

        $customers = Customer::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'purok', 'meter_number', 'initial_reading']);

        // Latest reading per customer (by date), excluding the reading being
        // edited so its own value is never treated as the previous reading.
        // These mirror the maps passed to create(), letting the edit form reuse
        // the same previous-reading and date-range hints.
        $others = MeterReading::orderBy('reading_date', 'desc')
            ->orderBy('id', 'desc')
            ->where('id', '!=', $reading->id)
            ->get(['customer_id', 'meter_reading', 'reading_date'])
            ->groupBy('customer_id');

        $previousReadings = $customers->mapWithKeys(fn ($c) => [
            $c->id => (string) ($others->get($c->id)?->first()?->meter_reading ?? $c->initial_reading ?? 0),
        ]);

        $latestReadingDates = $others->mapWithKeys(fn ($group, $customerId) => [$customerId => $group->first()->reading_date->toDateString()]);

        $meterReaders = User::recorders()->orderBy('username')->get(['id', 'username']);

        // Keep the currently assigned reader in the list even if they have since
        // been demoted, so existing (unbilled) readings stay editable.
        if ($reading->meter_reader_id && ! $meterReaders->contains('id', $reading->meter_reader_id)) {
            $current = User::find($reading->meter_reader_id, ['id', 'username']);
            if ($current) {
                $meterReaders->prepend($current);
            }
        }

        return Inertia::render('admin/meter-readings/edit', [
            'reading' => $reading,
            'customers' => $customers,
            'previousReadings' => $previousReadings,
            'latestReadingDates' => $latestReadingDates,
            'meterReaders' => $meterReaders,
        ]);
    }

    public function update(Request $request, MeterReading $reading)
    {
        if ($locked = $this->lockedRedirect($reading)) {
            return $locked;
        }

        // Only allow updating unbilled readings
        $billed = Bill::where('customer_id', $reading->customer_id)
            ->whereDate('billing_date', $reading->reading_date)
            ->exists();

        if ($billed) {
            return redirect()->route('admin.meter-readings.index')
                ->with('error', 'This reading already has a bill and cannot be updated.');
        }

        $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'meter_reader_id' => [
                'required',
                // New assignments must be active meter readers (or admins); the
                // reading's existing reader stays valid even if demoted.
                Rule::exists('users', 'id')->where(function ($q) use ($reading) {
                    $q->where('role', 'admin')
                        ->orWhere(fn ($qq) => $qq->where('role', 'staff')->where('position', 'meter_reader'))
                        ->orWhere('id', $reading->meter_reader_id);
                }),
            ],
            'meter_reading' => ['required', 'numeric', 'min:0'],
            'reading_date' => ['required', 'date', 'before_or_equal:today'],
        ]);

        $customer = Customer::findOrFail($request->customer_id);
        $customerChanged = (int) $request->customer_id !== (int) $reading->customer_id;

        // When the reading moves onto a new customer's reading chain, it must
        // fit that chain the same way a new reading would: its date must be
        // after the new customer's latest recorded reading date. An unchanged
        // customer keeps the existing behavior — only duplicates are rejected.
        if ($customerChanged) {
            $lastReadingDate = MeterReading::where('customer_id', $customer->id)
                ->orderByDesc('reading_date')
                ->orderByDesc('id')
                ->value('reading_date');

            if ($lastReadingDate && Carbon::parse($request->reading_date)->lte($lastReadingDate)) {
                return back()->withErrors([
                    'reading_date' => "The reading date must be after the customer's latest recorded reading date ({$lastReadingDate->toDateString()}).",
                ])->withInput();
            }
        }

        $previousReading = $reading->previousReadingValue($customer->id);
        $currentReading = (float) $request->meter_reading;

        if ($currentReading < $previousReading) {
            return back()->withErrors([
                'meter_reading' => "Meter reading ({$currentReading}) cannot be less than the previous reading ({$previousReading}).",
            ])->withInput();
        }

        // One reading per customer per date — prevent moving this reading onto
        // a date that already has one (for either the original or new customer).
        if (MeterReading::where('customer_id', $customer->id)
            ->whereDate('reading_date', $request->reading_date)
            ->where('id', '!=', $reading->id)
            ->exists()) {
            return back()->withErrors([
                'reading_date' => 'A meter reading already exists for this customer on the selected date.',
            ])->withInput();
        }

        // Only the editable fields are saved. updated_at (and created_at,
        // recorded_by_user_id, status) are managed by the system — updated_at is
        // refreshed automatically by Eloquent on every successful save.
        $reading->update([
            'customer_id' => $customer->id,
            'meter_reader_id' => $request->meter_reader_id,
            'meter_reading' => $currentReading,
            'reading_date' => $request->reading_date,
        ]);

        return redirect()->route('admin.meter-readings.index')
            ->with('success', 'Meter reading updated successfully.');
    }
}
