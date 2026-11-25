<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\AbstractPaginator;

class MeterReading extends Model
{
    protected $fillable = [
        'customer_id',
        'meter_reader_id',
        'recorded_by_user_id',
        'reading_date',
        'meter_reading',
        'status',
    ];

    protected $casts = [
        // date:Y-m-d keeps the attribute a Carbon on read, but serializes it as
        // a plain calendar date (YYYY-MM-DD) instead of the framework default
        // UTC ISO-8601 timestamp. That prevents a date like 2026-08-02 (Manila)
        // from arriving on the client as "2026-08-01T16:00:00.000000Z" and
        // being displayed one day earlier. Note: this cast resolves to
        // custom_datetime, so a Carbon assigned on set is converted to a storable
        // string by the connection's prepareBindings at save time.
        'reading_date'  => 'date:Y-m-d',
        'meter_reading' => 'float',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function meterReader()
    {
        return $this->belongsTo(User::class, 'meter_reader_id');
    }

    public function recorder()
    {
        return $this->belongsTo(User::class, 'recorded_by_user_id');
    }

    /**
     * The meter reading value recorded just before this one, falling back to
     * the customer's initial reading (or 0) when there is none. Pass a
     * customer id to look the previous reading up for a different customer
     * (e.g. when the reading is being moved to a new customer).
     */
    public function previousReadingValue(?int $customerId = null): float
    {
        $customerId = $customerId ?? $this->customer_id;

        $previous = static::where('customer_id', $customerId)
            ->where('id', '!=', $this->id)
            ->orderByDesc('reading_date')
            ->orderByDesc('id')
            ->value('meter_reading');

        if ($previous !== null) {
            return (float) $previous;
        }

        $customer = $customerId === $this->customer_id ? $this->customer : Customer::find($customerId);

        return (float) (optional($customer)->initial_reading ?? 0);
    }

    /**
     * Attach derived display attributes (previous_reading, consumption, bill_id)
     * to a paginator or collection of readings so the UI can show the same
     * information the old schema stored explicitly.
     */
    public static function decorate($readings)
    {
        $collection = $readings instanceof AbstractPaginator ? $readings->getCollection() : $readings;

        if ($collection->isEmpty()) {
            return $readings;
        }

        $customerIds = $collection->pluck('customer_id')->unique()->values();

        $readingsByCustomer = static::whereIn('customer_id', $customerIds)
            ->orderBy('customer_id')
            ->orderBy('reading_date')
            ->orderBy('id')
            ->get(['id', 'customer_id', 'reading_date', 'meter_reading'])
            ->groupBy('customer_id');

        $billMap = Bill::whereIn('customer_id', $customerIds)
            ->get(['id', 'customer_id', 'billing_date'])
            ->mapWithKeys(fn ($bill) => [$bill->customer_id . '|' . $bill->billing_date->toDateString() => $bill->id]);

        $collection->transform(function (MeterReading $reading) use ($readingsByCustomer, $billMap) {
            $list = $readingsByCustomer->get($reading->customer_id, collect());
            $index = $list->search(fn ($item) => (int) $item->id === (int) $reading->id);

            $previousReading = $index !== false && $index > 0 ? $list[$index - 1] : null;

            $previous = $previousReading
                ? (float) $previousReading->meter_reading
                : (float) (optional($reading->customer)->initial_reading ?? 0);

            $current = (float) $reading->meter_reading;

            $reading->previous_reading      = (string) round($previous, 2);
            $reading->previous_reading_date = $previousReading?->reading_date?->toDateString();
            $reading->meter_reading         = (string) round($current, 2);
            $reading->consumption           = (string) round(max($current - $previous, 0), 2);
            $reading->bill_id               = $billMap[$reading->customer_id . '|' . $reading->reading_date->toDateString()] ?? null;

            return $reading;
        });

        return $readings;
    }
}
