<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;
use NotificationChannels\WebPush\HasPushSubscriptions;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasPushSubscriptions;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'username',
        'password',
        'role',
        'position',
    ];

    /**
     * Eager load relationships by default.
     */
    protected $with = ['customer'];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = [
        'first_name',
        'last_name',
        'full_name',
        'email',
        'address',
        'household_address',
        'phone',
        'phone_number',
        'position_label',
    ];

    public function getFirstNameAttribute()
    {
        return $this->role === 'customer' && $this->customer ? $this->customer->first_name : $this->username;
    }

    public function getLastNameAttribute()
    {
        return $this->role === 'customer' && $this->customer ? $this->customer->last_name : '';
    }

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        if ($this->role === 'customer' && $this->customer) {
            return "{$this->customer->first_name} {$this->customer->last_name}";
        }
        return $this->username;
    }

    public function getEmailAttribute()
    {
        return $this->role === 'customer' && $this->customer ? $this->customer->email : '';
    }

    public function getAddressAttribute()
    {
        return $this->role === 'customer' && $this->customer ? $this->customer->household_address : '';
    }

    public function getHouseholdAddressAttribute()
    {
        return $this->role === 'customer' && $this->customer ? $this->customer->household_address : '';
    }

    public function getPhoneAttribute()
    {
        return $this->role === 'customer' && $this->customer ? $this->customer->phone_number : '';
    }

    public function getPhoneNumberAttribute()
    {
        return $this->role === 'customer' && $this->customer ? $this->customer->phone_number : '';
    }

    /**
     * Human-readable label for the staff position.
     */
    public function getPositionLabelAttribute(): ?string
    {
        return match ($this->position) {
            'administrator' => 'Administrator',
            'encoder'       => 'Encoder',
            'meter_reader'  => 'Meter Reader',
            default         => null,
        };
    }

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isStaff(): bool
    {
        return $this->role === 'staff';
    }

    /**
     * Scope to staff members assigned as meter readers.
     */
    public function scopeMeterReaders(Builder $query): Builder
    {
        return $query->where('role', 'staff')->where('position', 'meter_reader');
    }

    /**
     * Scope to users who may record readings: staff meter readers plus
     * administrators (admins can also act as meter readers).
     */
    public function scopeRecorders(Builder $query): Builder
    {
        return $query->where('role', 'admin')
            ->orWhere(function (Builder $q) {
                $q->where('role', 'staff')->where('position', 'meter_reader');
            });
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function customer()
    {
        return $this->hasOne(Customer::class);
    }

    public function bills()
    {
        return $this->hasManyThrough(Bill::class, Customer::class);
    }

    public function payments()
    {
        return $this->hasManyThrough(Payment::class, Customer::class);
    }

    public function meterReadings()
    {
        return $this->hasManyThrough(MeterReading::class, Customer::class);
    }
}