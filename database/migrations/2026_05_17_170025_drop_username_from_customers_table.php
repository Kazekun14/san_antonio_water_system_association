<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // SQLite refuses to drop a column that is still referenced by an index
        // (MySQL drops the index automatically), so remove the unique index over
        // username first — harmless on both drivers.
        $indexes = Schema::getIndexes('customers');
        foreach ($indexes as $index) {
            if (in_array('username', $index['columns'] ?? [], true)) {
                Schema::table('customers', function (Blueprint $table) use ($index) {
                    $table->dropIndex($index['name']);
                });
            }
        }

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('username');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->string('username')->nullable()->unique();
        });
    }
};
