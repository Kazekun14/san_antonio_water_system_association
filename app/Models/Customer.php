<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'household_address',
        'purok',
        'meter_number',
        'email',
        'initial_reading',
        'phone_number',
        'balance',
        'user_id',
        'access_type',
        'connection_status',
    ];

    protected $appends = ['full_name', 'address', 'zone', 'phone'];

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getAddressAttribute()
    {
        return $this->household_address;
    }

    public function getZoneAttribute()
    {
        return $this->purok;
    }

    public function getPhoneAttribute()
    {
        return $this->phone_number;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bills()
    {
        return $this->hasMany(Bill::class);
    }

    public function meterReadings()
    {
        return $this->hasMany(MeterReading::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
