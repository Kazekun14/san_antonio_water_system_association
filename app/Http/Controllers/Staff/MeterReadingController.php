<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Imports\MeterReadingImport;
use App\Imports\MeterReadingImportValidationException;
use App\Models\Customer;
use App\Models\MeterReading;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class MeterReadingController extends Controller
{
    public function index()
    {
        $readings = MeterReading::with(['customer', 'recorder'])
            // Pending readings always surface before finalized ones; within each
            // status group the newest records (reading date, then id) come first.
            ->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END")
            ->orderBy('reading_date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(5)
            ->withQueryString();

        // Attach derived display fields (previous_reading, consumption, bill_id)
        MeterReading::decorate($readings);

        return Inertia::render('staff/meter-readings/index', [
            'readings' => $readings,
        ]);
    }

    public function create()
    {
        $customers = Customer::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'purok', 'meter_number', 'initial_reading']);

        // Previous reading per customer: last recorded reading, falling back to initial reading or 0
        $lastReadings = MeterReading::selectRaw('customer_id, MAX(meter_reading) as last_reading')
            ->groupBy('customer_id')
            ->pluck('last_reading', 'customer_id');

        $previousReadings = $customers->mapWithKeys(fn ($c) => [
            $c->id => (string) ($lastReadings[$c->id] ?? $c->initial_reading ?? 0),
        ]);

        $meterReaders = User::meterReaders()->orderBy('username')->get(['id', 'username']);

        return Inertia::render('staff/meter-readings/create', [
            'customers' => $customers,
            'previousReadings' => $previousReadings,
            'meterReaders' => $meterReaders,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'meter_reader_id' => ['required', Rule::exists('users', 'id')->where('position', 'meter_reader')],
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

        $currentReading = (float) $request->meter_reading;

        if ($currentReading < $previousReading) {
            return back()->withErrors([
                'meter_reading' => "Meter reading ({$currentReading}) cannot be less than the previous reading ({$previousReading}).",
            ])->withInput();
        }

        MeterReading::create([
            'customer_id' => $customer->id,
            'meter_reader_id' => $request->meter_reader_id,
            'recorded_by_user_id' => Auth::id(),
            'meter_reading' => $currentReading,
            'reading_date' => $request->reading_date,
        ]);

        return redirect()->route('staff.meter-readings.index')
            ->with('success', 'Meter reading recorded successfully.');
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

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt,xls,xlsx',
        ]);

        try {
            $import = new MeterReadingImport;

            Excel::import($import, $request->file('file'));

            return redirect()->route('staff.meter-readings.index')
                ->with('success', $import->summaryMessage());
        } catch (MeterReadingImportValidationException $e) {
            // One or more rows failed validation — no records were imported.
            return redirect()->route('staff.meter-readings.index')
                ->with('error', $e->errors());
        } catch (\Exception $e) {
            return redirect()->route('staff.meter-readings.index')
                ->with('error', 'There was an error importing the file: '.$e->getMessage());
        }
    }
}
