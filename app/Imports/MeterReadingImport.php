<?php

namespace App\Imports;

use App\Models\Customer;
use App\Models\MeterReading;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class MeterReadingImport implements ToCollection, WithHeadingRow
{
    private ?Collection $customersCache = null;

    /**
     * Number of non-empty data rows found in the uploaded file.
     */
    public int $totalRows = 0;

    /**
     * Number of meter readings actually inserted.
     */
    public int $importedCount = 0;

    /**
     * Rows skipped because a reading for the same customer already exists on
     * the same reading date. Each entry holds the customer's full name and the
     * duplicate date (formatted MM/DD/YYYY) for the import summary.
     *
     * @var list<array{customer: string, reading_date: string}>
     */
    public array $skippedDuplicates = [];

    /**
     * The staff member credited as the meter reader for the imported readings.
     */
    private ?int $meterReaderId;

    /**
     * Reading date chosen on the import form. Applied to every imported record.
     *
     * @var Carbon|\DateTime|string|null
     */
    private $readingDate;

    public function __construct(?int $meterReaderId = null, $readingDate = null)
    {
        $this->meterReaderId = $meterReaderId;
        $this->readingDate = $readingDate;
    }

    /**
     * Import every data row of the sheet.
     *
     * Validation runs in two passes so a file that contains a bad row is
     * rejected before anything is written to the database:
     *   1. Every row is checked, every error is collected and every customer
     *      is resolved — the file is only imported when every row passes.
     *      Rows that duplicate an existing reading (same customer + reading
     *      date) are not errors: they are skipped and reported in the summary.
     *   2. Only then are the readings created, inside a single database
     *      transaction so a mid-import failure rolls back everything — no
     *      partial readings.
     *
     * @return void
     *
     * @throws MeterReadingImportValidationException
     */
    public function collection(Collection $rows)
    {
        // Keep the raw first row (before empty-value filtering) so missing
        // column detection is based on the actual headings — not on a row whose
        // cells happen to be empty (e.g. a row with a reading but no customer).
        $rawFirstRow = $rows->first();
        $rawFirstRow = $rawFirstRow instanceof Collection ? $rawFirstRow->toArray() : (array) $rawFirstRow;

        // Normalize each row to a plain array keyed by the slugified headings
        // ("Customer" => customer, "Meter Reading (m³)" => meter_reading_m3,
        // legacy "Reading (m³)" => reading_m3) and drop rows that are
        // completely empty.
        $rows = $rows->map(function ($row) {
            $row = $row instanceof Collection ? $row->toArray() : (array) $row;

            return array_filter($row, fn ($value) => $value !== null && $value !== '');
        })->filter(fn ($row) => $row !== []);

        // Keys are preserved on purpose so $index below keeps matching the
        // actual spreadsheet row even when blank lines were filtered out.

        if ($rows->isEmpty()) {
            throw new MeterReadingImportValidationException([
                'The Excel file is empty. Download the template, fill in the Customer and Meter Reading (m³) columns, then import it again.',
            ]);
        }

        $this->totalRows = $rows->count();

        $this->assertRequiredColumns($rawFirstRow);

        // Pass 1 — validate every row and collect *every* error so the user can
        // fix the whole file at once. Nothing is written to the database when
        // any row is invalid.
        $errors = [];
        $entries = [];

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2; // 1 for the heading row + 0-based index.

            // Required field: every row must reference a customer.
            $customerName = trim((string) ($row['customer'] ?? $row['customer_name'] ?? ''));
            if ($customerName === '') {
                $errors[] = "Row {$rowNumber}: Customer is required (the Customer column is empty).";

                continue;
            }

            // Customer existence.
            try {
                $customer = $this->findCustomer($customerName, (string) ($row['purok'] ?? ''));
            } catch (\Exception $e) {
                $errors[] = "Row {$rowNumber}: {$e->getMessage()}";

                continue;
            }

            if (! $customer) {
                $errors[] = "Row {$rowNumber}: Customer '{$customerName}' does not exist.";

                continue;
            }

            // Meter reading: required, numeric, non-negative and in the expected
            // decimal format (e.g. 0, 15, 15.50, 100.00).
            $readingValue = $row['meter_reading_m3'] ?? $row['reading_m3'] ?? $row['meter_reading'] ?? $row['reading'] ?? null;
            $readingRaw = trim((string) $readingValue);

            if ($readingValue === null || $readingRaw === '') {
                $errors[] = "Row {$rowNumber}: Meter Reading (m³) is required.";

                continue;
            }

            if (! is_numeric($readingRaw)) {
                $errors[] = "Row {$rowNumber}: Meter Reading (m³) value \"{$readingRaw}\" is not a valid number. Expected format: 0, 15, 15.50 or 100.00.";

                continue;
            }

            $currentReading = (float) $readingRaw;

            if ($currentReading < 0) {
                $errors[] = "Row {$rowNumber}: Meter Reading (m³) cannot be negative ({$currentReading}).";

                continue;
            }

            // Strict decimal format: rejects scientific notation, hex, thousand
            // separators and other malformed values is_numeric() would accept.
            // Only text cells are checked — real numeric cells (floats) are
            // inherently well-formed, even when Excel renders them as 1.2E+16.
            if (is_string($readingValue) && ! preg_match('/^\d+(\.\d+)?$/', $readingRaw)) {
                $errors[] = "Row {$rowNumber}: Meter Reading (m³) value \"{$readingRaw}\" has an invalid format. Expected format: 0, 15, 15.50 or 100.00.";

                continue;
            }

            // The date the reading would be recorded on: the date picked on the
            // import form wins; legacy templates may carry a per-row date.
            $readingDate = $this->transformDate(
                $this->readingDate ?? $row['reading_date'] ?? $row['date'] ?? now()
            );

            // Duplicate check: a reading already exists for this customer on
            // this date (e.g. the same file was uploaded before). The row is
            // skipped — not imported — and reported in the summary instead of
            // failing the whole file.
            if ($this->isDuplicate($customer->id, $readingDate)) {
                $this->recordDuplicate($customer, $readingDate);

                continue;
            }

            // The reading date must be after the customer's latest recorded
            // reading date — the same rule the manual form enforces. On or
            // before the latest reading date is rejected (the exact latest date
            // is also caught by the duplicate check above).
            $lastReading = MeterReading::where('customer_id', $customer->id)
                ->orderByDesc('reading_date')
                ->orderByDesc('id')
                ->first();

            if ($lastReading && Carbon::parse($readingDate)->lte($lastReading->reading_date)) {
                $errors[] = "Row {$rowNumber}: the reading date ({$readingDate->format('m/d/Y')}) must be after the latest recorded reading date ({$lastReading->reading_date->format('m/d/Y')}) for {$customer->full_name}.";

                continue;
            }

            // The reading must be >= the customer's previous reading (last
            // recorded reading, falling back to the initial reading, or 0).
            $previousReading = $lastReading
                ? (float) $lastReading->meter_reading
                : (float) ($customer->initial_reading ?? 0);

            if ($currentReading < $previousReading) {
                $errors[] = "Row {$rowNumber}: the reading ({$currentReading}) cannot be less than the previous reading ({$previousReading}) for {$customer->full_name}.";

                continue;
            }

            $entries[] = [
                'customer' => $customer,
                'currentReading' => $currentReading,
                'readingDate' => $readingDate,
            ];
        }

        if ($errors !== []) {
            throw new MeterReadingImportValidationException($errors);
        }

        // Pass 2 — create the readings now that the whole file has been
        // validated. Everything happens inside one transaction so an unexpected
        // error rolls back the entire import — no partial readings.
        DB::transaction(function () use ($entries) {
            foreach ($entries as $entry) {
                // Re-check for duplicates: this catches rows that repeat the
                // same customer + date within this same file (the first
                // occurrence wins, even if the later row has a different
                // reading value — a duplicate is defined by customer + date
                // alone) and anything created since pass 1.
                if ($this->isDuplicate($entry['customer']->id, $entry['readingDate'])) {
                    $this->recordDuplicate($entry['customer'], $entry['readingDate']);

                    continue;
                }

                $this->createReading(
                    $entry['customer'],
                    $entry['currentReading'],
                    $entry['readingDate']
                );

                $this->importedCount++;
            }
        });
    }

    /**
     * Make sure the uploaded file contains the columns the template requires.
     * The current template (Customer / Meter Reading (m³)) plus the legacy
     * templates (Customer Name / Purok / Meter Reading / Reading Date and
     * Customer / Date / Reading (m³)) are accepted.
     *
     *
     * @throws MeterReadingImportValidationException
     */
    private function assertRequiredColumns(array $firstRow): void
    {
        $hasCustomer = array_key_exists('customer', $firstRow) || array_key_exists('customer_name', $firstRow);
        $hasReading = array_key_exists('meter_reading_m3', $firstRow)
            || array_key_exists('reading_m3', $firstRow)
            || array_key_exists('meter_reading', $firstRow)
            || array_key_exists('reading', $firstRow);

        if (! $hasCustomer) {
            throw new MeterReadingImportValidationException([
                'The Excel file is missing the required "Customer" column. Please use the updated template (columns: Customer, Meter Reading (m³)).',
            ]);
        }

        if (! $hasReading) {
            throw new MeterReadingImportValidationException([
                'The Excel file is missing the required "Reading (m³)" column. Please use the updated template (columns: Customer, Meter Reading (m³)).',
            ]);
        }
    }

    /**
     * Create the meter reading (with the selected meter reader, reading date and
     * the current user as recorder). Billing is handled separately — importing
     * a reading does not generate a bill.
     */
    private function createReading(Customer $customer, float $currentReading, \DateTimeInterface $readingDate): void
    {
        MeterReading::create([
            'customer_id' => $customer->id,
            'meter_reader_id' => $this->meterReaderId,
            'recorded_by_user_id' => Auth::id(),
            'meter_reading' => $currentReading,
            'reading_date' => $readingDate->format('Y-m-d'),
        ]);
    }

    /**
     * Whether a meter reading already exists for the given customer and date.
     */
    private function isDuplicate(int $customerId, \DateTimeInterface $readingDate): bool
    {
        return MeterReading::where('customer_id', $customerId)
            ->whereDate('reading_date', $readingDate->format('Y-m-d'))
            ->exists();
    }

    /**
     * Record a skipped duplicate row so it can be shown in the import summary.
     */
    private function recordDuplicate(Customer $customer, \DateTimeInterface $readingDate): void
    {
        $this->skippedDuplicates[] = [
            'customer' => $customer->full_name,
            'reading_date' => $readingDate->format('m/d/Y'),
        ];
    }

    /**
     * Build the human-readable import summary flashed to the user.
     */
    public function summaryMessage(): string
    {
        if ($this->importedCount === 0) {
            return 'No new meter readings were imported because all records already exist.';
        }

        $lines = [
            'Import completed successfully.',
            '',
            '• Total rows: '.$this->totalRows,
            '• Imported: '.$this->importedCount,
            '• Skipped (Duplicates): '.count($this->skippedDuplicates),
        ];

        if ($this->skippedDuplicates !== []) {
            $lines[] = '';
            $lines[] = 'Duplicate Records:';

            foreach ($this->skippedDuplicates as $duplicate) {
                $lines[] = '- '.$duplicate['customer'].' ('.$duplicate['reading_date'].')';
            }
        }

        return implode("\n", $lines);
    }

    /**
     * Find a customer by their full name and optional purok.
     */
    private function findCustomer(string $name, string $purok = ''): ?Customer
    {
        if ($this->customersCache === null) {
            $this->customersCache = Customer::all(['id', 'first_name', 'last_name', 'purok', 'initial_reading']);
        }

        $nameKey = $this->normalize($name);
        $purokKey = $this->normalize($purok);

        if ($purokKey !== '') {
            // Purok provided (legacy template): require an exact name + purok match.
            return $this->customersCache->first(function (Customer $customer) use ($nameKey, $purokKey) {
                return $this->normalize($customer->full_name) === $nameKey
                    && $this->normalize((string) $customer->purok) === $purokKey;
            });
        }

        // No purok provided (current template): match by name alone, but only
        // when the name is unambiguous so a reading is never credited to the
        // wrong household.
        $matches = $this->customersCache->filter(function (Customer $customer) use ($nameKey) {
            return $this->normalize($customer->full_name) === $nameKey;
        });

        if ($matches->isEmpty()) {
            return null;
        }

        if ($matches->count() > 1) {
            throw new \Exception("Multiple customers named \"{$name}\" were found. Include the Purok column in the file to identify the correct household.");
        }

        return $matches->first();
    }

    private function normalize(?string $value): string
    {
        return mb_strtolower(preg_replace('/\s+/', ' ', trim((string) $value)));
    }

    /**
     * Transform date from excel format or string to Carbon date.
     *
     * @param  mixed  $value
     * @return Carbon|\DateTime
     */
    private function transformDate($value)
    {
        try {
            if (is_numeric($value)) {
                return Date::excelToDateTimeObject($value);
            }

            return Carbon::parse($value);
        } catch (\Exception $e) {
            return Carbon::now();
        }
    }
}
