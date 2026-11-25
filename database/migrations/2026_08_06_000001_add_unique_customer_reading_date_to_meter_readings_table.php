<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Guarantee one meter reading per customer per reading date at the
     * database level, so duplicates cannot be inserted even if application
     * validation is bypassed.
     */
    public function up(): void
    {
        if (! Schema::hasTable('meter_readings')) {
            return;
        }

        // Already in place (e.g. applied manually) — nothing to do.
        if (Schema::hasIndex('meter_readings', ['customer_id', 'reading_date'])) {
            return;
        }

        // Remove any legacy duplicates first so the unique index can be
        // created. Keeps the earliest record per customer + reading date.
        if (DB::getDriverName() === 'mysql') {
            DB::statement(
                'DELETE r1 FROM meter_readings r1 '
                .'INNER JOIN meter_readings r2 '
                .'ON r1.customer_id = r2.customer_id AND r1.reading_date = r2.reading_date '
                .'WHERE r1.id > r2.id'
            );
        } else {
            DB::statement(
                'DELETE FROM meter_readings '
                .'WHERE id NOT IN (SELECT MIN(id) FROM meter_readings GROUP BY customer_id, reading_date)'
            );
        }

        Schema::table('meter_readings', function (Blueprint $table) {
            $table->unique(['customer_id', 'reading_date']);
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('meter_readings')) {
            return;
        }

        if (Schema::hasIndex('meter_readings', ['customer_id', 'reading_date'])) {
            Schema::table('meter_readings', function (Blueprint $table) {
                $table->dropUnique(['customer_id', 'reading_date']);
            });
        }
    }
};
