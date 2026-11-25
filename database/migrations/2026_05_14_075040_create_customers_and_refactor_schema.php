<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create customers table
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('username')->unique()->nullable(); // For mapping during import
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->decimal('balance', 15, 2)->default(0);
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 2. Data Migration: Move existing customer role users to customers table
        $existingCustomers = DB::table('users')->where('role', 'customer')->get();
        foreach ($existingCustomers as $user) {
            DB::table('customers')->insert([
                'first_name' => $user->first_name,
                'last_name'  => $user->last_name,
                'username'   => $user->username,
                'address'    => $user->address,
                'phone'      => $user->phone,
                'balance'    => $user->balance,
                'user_id'    => $user->id,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]);
        }

        // 3. Update Bills Table
        Schema::table('bills', function (Blueprint $table) {
            $table->foreignId('customer_id')->nullable()->after('user_id')->constrained('customers')->onDelete('cascade');
        });

        // Populate customer_id in bills (UPDATE ... JOIN is MySQL-only; run as
        // a loop instead so the suite also works on SQLite)
        $bills = DB::table('bills')->whereNull('customer_id')->get(['id', 'user_id']);
        foreach ($bills as $bill) {
            $customerId = DB::table('customers')->where('user_id', $bill->user_id)->value('id');
            if ($customerId) {
                DB::table('bills')->where('id', $bill->id)->update(['customer_id' => $customerId]);
            }
        }

        Schema::table('bills', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
            $table->foreignId('customer_id')->nullable(false)->change();
        });

        // 4. Update Meter Readings Table
        Schema::table('meter_readings', function (Blueprint $table) {
            $table->foreignId('customer_id')->nullable()->after('user_id')->constrained('customers')->onDelete('cascade');
        });

        // Populate customer_id in meter_readings (DB-agnostic loop)
        $meterReadings = DB::table('meter_readings')->whereNull('customer_id')->get(['id', 'user_id']);
        foreach ($meterReadings as $reading) {
            $customerId = DB::table('customers')->where('user_id', $reading->user_id)->value('id');
            if ($customerId) {
                DB::table('meter_readings')->where('id', $reading->id)->update(['customer_id' => $customerId]);
            }
        }

        Schema::table('meter_readings', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
            $table->foreignId('customer_id')->nullable(false)->change();
        });

        // 5. Update Payments Table
        Schema::table('payments', function (Blueprint $table) {
            $table->foreignId('customer_id')->nullable()->after('user_id')->constrained('customers')->onDelete('cascade');
        });

        // Populate customer_id in payments (DB-agnostic loop)
        $payments = DB::table('payments')->whereNull('customer_id')->get(['id', 'user_id']);
        foreach ($payments as $payment) {
            $customerId = DB::table('customers')->where('user_id', $payment->user_id)->value('id');
            if ($customerId) {
                DB::table('payments')->where('id', $payment->id)->update(['customer_id' => $customerId]);
            }
        }

        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
            $table->foreignId('customer_id')->nullable(false)->change();
        });

        // 6. Clean up Users table (optional: remove fields that moved to customers)
        Schema::table('users', function (Blueprint $table) {
            // We keep these for Admin/Staff, but they are redundant for Customers who have accounts.
            // However, it's safer to keep them for now or make them nullable.
            $table->string('first_name')->nullable()->change();
            $table->string('last_name')->nullable()->change();
            $table->string('username')->nullable()->change();
            $table->string('address')->nullable()->change();
            $table->string('phone')->nullable()->change();
            $table->decimal('balance', 15, 2)->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse process is complex, usually just drop the table in dev
        Schema::dropIfExists('customers');
        
        // Restore user_id columns would be needed for a full reversal
    }
};
