<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WaterRate extends Model
{
    protected $fillable = [
        'base_rate',
        'rate_per_cubic_meter',
        'penalty_amount',
        'billing_cycle_day',
        'barangay_name',
        'barangay_address',
        'contact_number',
    ];

    protected $casts = [
        'base_rate'            => 'float',
        'rate_per_cubic_meter' => 'float',
        'penalty_amount'       => 'float',
        'billing_cycle_day'    => 'integer',
    ];

    /**
     * Get the current active water rate settings (always just one row).
     */
    public static function current(): self
    {
        return self::firstOrCreate([], [
            'base_rate'             => 200.00,
            'rate_per_cubic_meter'  => 15.00,
            'penalty_amount'        => 50.00,
            'billing_cycle_day'     => 1,
            'barangay_name'         => 'Barangay San Antonio',
            'barangay_address'      => 'San Antonio, Philippines',
            'contact_number'        => 'N/A',
        ]);
    }
}
