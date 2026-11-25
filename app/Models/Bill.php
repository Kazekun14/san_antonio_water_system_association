<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    protected $fillable = [
        'customer_id',
        'billing_date',
        'consumption',
        'amount',
        'status',
        'due_date',
        'seen_at',
    ];

    protected $casts = [
        'billing_date' => 'date',
        'due_date'     => 'date',
        'seen_at'      => 'datetime',
        'consumption'  => 'float',
        'amount'       => 'float',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
