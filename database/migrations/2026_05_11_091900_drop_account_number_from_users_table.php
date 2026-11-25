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
        // account_number first — harmless on both drivers.
        $indexes = Schema::getIndexes('users');
        foreach ($indexes as $index) {
            if (in_array('account_number', $index['columns'] ?? [], true)) {
                Schema::table('users', function (Blueprint $table) use ($index) {
                    $table->dropIndex($index['name']);
                });
            }
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('account_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('account_number', 50)->nullable()->after('username');
        });
    }
};
