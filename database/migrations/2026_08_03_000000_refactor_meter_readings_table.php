<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Refactor meter_readings to the new schema:
     * id, meter_reader_id, customer_id, recorded_by_user_id, reading_date,
     * meter_reading, created_at, updated_at
     *
     * The legacy columns (bill_id, previous_reading, current_reading,
     * consumption, recorded_by) are dropped. The migration is defensive so it
     * is a no-op if the table was already updated manually.
     */
    public function up(): void
    {
        // Drop legacy foreign keys before dropping their columns (MySQL requirement)
        $this->dropForeignKeyIfExists('meter_readings', 'meter_readings_bill_id_foreign');
        $this->dropForeignKeyIfExists('meter_readings', 'meter_readings_recorded_by_foreign');

        // Remove legacy columns that no longer exist in the new schema
        Schema::table('meter_readings', function (Blueprint $table) {
            foreach (['bill_id', 'previous_reading', 'current_reading', 'consumption', 'recorded_by'] as $column) {
                if (Schema::hasColumn('meter_readings', $column)) {
                    $table->dropColumn($column);
                }
            }
        });

        // Add the new columns if they are missing
        if (! Schema::hasColumn('meter_readings', 'meter_reader_id')) {
            Schema::table('meter_readings', function (Blueprint $table) {
                $table->foreignId('meter_reader_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
            });
        }

        if (! Schema::hasColumn('meter_readings', 'recorded_by_user_id')) {
            Schema::table('meter_readings', function (Blueprint $table) {
                $table->foreignId('recorded_by_user_id')->nullable()->after('customer_id')->constrained('users')->nullOnDelete();
            });
        }

        if (! Schema::hasColumn('meter_readings', 'meter_reading')) {
            Schema::table('meter_readings', function (Blueprint $table) {
                $table->decimal('meter_reading', 12, 2)->default(0)->after('reading_date');
            });
        }
    }

    /**
     * Best-effort reversal: restore the legacy columns.
     */
    public function down(): void
    {
        $this->dropForeignKeyIfExists('meter_readings', 'meter_readings_meter_reader_id_foreign');
        $this->dropForeignKeyIfExists('meter_readings', 'meter_readings_recorded_by_user_id_foreign');

        Schema::table('meter_readings', function (Blueprint $table) {
            foreach (['meter_reader_id', 'recorded_by_user_id', 'meter_reading'] as $column) {
                if (Schema::hasColumn('meter_readings', $column)) {
                    $table->dropColumn($column);
                }
            }
        });

        Schema::table('meter_readings', function (Blueprint $table) {
            if (! Schema::hasColumn('meter_readings', 'bill_id')) {
                $table->foreignId('bill_id')->nullable()->after('customer_id')->constrained()->onDelete('set null');
            }
            if (! Schema::hasColumn('meter_readings', 'previous_reading')) {
                $table->decimal('previous_reading', 10, 2)->default(0)->after('bill_id');
            }
            if (! Schema::hasColumn('meter_readings', 'current_reading')) {
                $table->decimal('current_reading', 10, 2)->default(0)->after('previous_reading');
            }
            if (! Schema::hasColumn('meter_readings', 'consumption')) {
                $table->decimal('consumption', 10, 2)->after('current_reading');
            }
            if (! Schema::hasColumn('meter_readings', 'recorded_by')) {
                $table->foreignId('recorded_by')->after('reading_date')->constrained('users')->onDelete('cascade');
            }
        });
    }

    private function dropForeignKeyIfExists(string $table, string $name): void
    {
        if (! Schema::hasTable($table)) {
            return;
        }

        if (DB::getDriverName() === 'mysql') {
            $exists = DB::table('information_schema.TABLE_CONSTRAINTS')
                ->where('TABLE_SCHEMA', DB::getDatabaseName())
                ->where('TABLE_NAME', $table)
                ->where('CONSTRAINT_NAME', $name)
                ->exists();

            if ($exists) {
                Schema::table($table, function (Blueprint $table) use ($name) {
                    $table->dropForeign($name);
                });
            }

            return;
        }

        // SQLite stores foreign keys without names and cannot drop them by name.
        // Laravel names them {table}_{column}_foreign, so derive the column and
        // drop by column instead (which triggers a table rebuild without the FK).
        $column = preg_replace('/^' . preg_quote($table, '/') . '_|_foreign$/', '', $name);

        $fks = DB::select('PRAGMA foreign_key_list("' . str_replace('"', '""', $table) . '")');
        $exists = collect($fks)->contains(fn ($fk) => $fk->from === $column);

        if ($exists) {
            Schema::table($table, function (Blueprint $table) use ($column) {
                $table->dropForeign([$column]);
            });
        }
    }
};
