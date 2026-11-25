<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\WaterRate;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create default Admin account
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'password' => Hash::make('Admin@12345'),
                'role'     => 'admin',
                'position' => 'administrator',
            ]
        );

        // Create default Staff account
        User::updateOrCreate(
            ['username' => 'staff'],
            [
                'password' => Hash::make('Staff@12345'),
                'role'     => 'staff',
                'position' => 'encoder',
            ]
        );

        // Seed default water rate settings
        WaterRate::firstOrCreate([], [
            'base_rate'            => 200.00,
            'rate_per_cubic_meter' => 15.00,
            'penalty_amount'       => 50.00,
            'billing_cycle_day'    => 1,
            'barangay_name'        => 'Barangay San Antonio',
            'barangay_address'     => 'San Antonio, Philippines',
            'contact_number'       => '09000000000',
        ]);
    }
}
