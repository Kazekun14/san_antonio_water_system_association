<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add balance to users table
        if (!Schema::hasColumn('users', 'balance')) {
            Schema::table('users', function (Blueprint $table) {
                $table->decimal('balance', 10, 2)->default(0.00)->after('phone');
            });
        }

        // Update payments table columns
        Schema::table('payments', function (Blueprint $table) {
            if (!Schema::hasColumn('payments', 'transaction_id')) {
                $table->string('transaction_id')->nullable()->after('bill_id');
            }
            if (!Schema::hasColumn('payments', 'reference_number')) {
                $table->string('reference_number')->nullable()->after('transaction_id');
            }
            if (Schema::hasColumn('payments', 'method')) {
                $table->renameColumn('method', 'payment_method');
            }
        });

        Schema::table('payments', function (Blueprint $table) {
            if (!Schema::hasColumn('payments', 'amount')) {
                $table->decimal('amount', 10, 2)->default(0.00)->after('payment_method');
            }
            if (!Schema::hasColumn('payments', 'checkout_url')) {
                $table->text('checkout_url')->nullable()->after('amount');
            }
            if (!Schema::hasColumn('payments', 'paid_at')) {
                $table->timestamp('paid_at')->nullable()->after('status');
            }
        });

        // Update status enum values
        if (config('database.default') === 'mysql') {
            // Change column to string temporarily to avoid truncation during transition
            DB::statement("ALTER TABLE payments MODIFY COLUMN status VARCHAR(255)");
            DB::statement("UPDATE payments SET status = 'paid' WHERE status = 'confirmed'");
            DB::statement("UPDATE payments SET status = 'failed' WHERE status = 'rejected'");
            DB::statement("UPDATE payments SET status = 'pending' WHERE status NOT IN ('pending', 'paid', 'failed', 'pending_cash')");
            DB::statement("ALTER TABLE payments MODIFY COLUMN status ENUM('pending', 'paid', 'failed', 'pending_cash') DEFAULT 'pending'");
            
            DB::statement("ALTER TABLE payments MODIFY COLUMN payment_method VARCHAR(255)");
            DB::statement("UPDATE payments SET payment_method = 'gcash' WHERE payment_method = 'online'");
            DB::statement("UPDATE payments SET payment_method = 'gcash' WHERE payment_method NOT IN ('gcash', 'paymaya', 'cash')");
            DB::statement("ALTER TABLE payments MODIFY COLUMN payment_method ENUM('gcash', 'paymaya', 'cash')");
        }
        
        // Remove old proof_image column if it exists
        if (Schema::hasColumn('payments', 'proof_image')) {
            Schema::table('payments', function (Blueprint $table) {
                $table->dropColumn('proof_image');
            });
        }
    }

    public function down(): void
    {
        // ... (down logic)
    }
};
