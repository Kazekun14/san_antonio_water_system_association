<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add a staff position to users so meter reader dropdowns only show
     * staff members who are actually meter readers.
     *
     * - admin    -> administrator
     * - staff    -> encoder | meter_reader
     * - customer -> (no position)
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('position', ['administrator', 'encoder', 'meter_reader'])
                ->nullable()
                ->after('role');
        });

        // Backfill existing accounts:
        // - admins are always Administrators
        // - existing staff default to Encoder (admins can promote real meter readers)
        DB::table('users')->where('role', 'admin')->update(['position' => 'administrator']);
        DB::table('users')->where('role', 'staff')->update(['position' => 'encoder']);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('position');
        });
    }
};
