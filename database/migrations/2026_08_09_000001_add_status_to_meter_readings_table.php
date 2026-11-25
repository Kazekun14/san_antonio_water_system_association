<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add the reading lifecycle status column.
     *
     * status ENUM('pending','finalized') NOT NULL DEFAULT 'pending'
     *
     * The column may already exist (e.g. it was created directly in the
     * database), so this migration is defensive: it only creates the column
     * when it is missing and never touches existing records.
     */
    public function up(): void
    {
        if (! Schema::hasTable('meter_readings')) {
            return;
        }

        if (Schema::hasColumn('meter_readings', 'status')) {
            return;
        }

        Schema::table('meter_readings', function (Blueprint $table) {
            $table->enum('status', ['pending', 'finalized'])
                ->default('pending')
                ->after('meter_reading');
        });
    }

    /**
     * Reverse the migration: drop the status column if it exists.
     */
    public function down(): void
    {
        if (! Schema::hasTable('meter_readings')) {
            return;
        }

        if (Schema::hasColumn('meter_readings', 'status')) {
            Schema::table('meter_readings', function (Blueprint $table) {
                $table->dropColumn('status');
            });
        }
    }
};
