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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'first_name')) {
                $table->string('first_name')->after('id')->nullable();
            }
            if (!Schema::hasColumn('users', 'last_name')) {
                $table->string('last_name')->after('first_name')->nullable();
            }
            if (!Schema::hasColumn('users', 'username')) {
                $table->string('username')->after('last_name')->nullable();
            }
        });

        // Copy data from name if it still exists
        if (Schema::hasColumn('users', 'name')) {
            DB::table('users')->update([
                'first_name' => DB::raw('name'),
            ]);
        }
        
        // Ensure defaults for non-nullable conversion
        DB::table('users')->whereNull('first_name')->update(['first_name' => '']);
        DB::table('users')->whereNull('last_name')->update(['last_name' => '']);

        // Generate usernames in PHP (CONCAT is MySQL-only and breaks SQLite tests)
        $ids = DB::table('users')->whereNull('username')->pluck('id');
        foreach ($ids as $id) {
            DB::table('users')->where('id', $id)->update(['username' => 'user_' . $id]);
        }

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'name')) {
                $table->dropColumn('name');
            }
            $table->string('first_name')->nullable(false)->change();
            $table->string('last_name')->nullable(false)->change();
            $table->string('username')->nullable(false)->change();
            
            // Add unique index to username if it doesn't have one
            // We'll do this in a separate call to be safe
        });

        Schema::table('users', function (Blueprint $table) {
            // Check if unique index already exists or just try adding it
            // To be safe, we'll try to add it and catch error or check existing indexes
            try {
                $table->unique('username');
            } catch (\Exception $e) {}

            try {
                $table->unique('phone');
            } catch (\Exception $e) {}
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'name')) {
                $table->string('name')->after('id')->nullable();
            }
        });

        // Rebuild name in PHP (CONCAT is MySQL-only and breaks SQLite tests).
        // Mirrors MySQL's CONCAT semantics: NULL when either part is NULL.
        $users = DB::table('users')->get(['id', 'first_name', 'last_name']);
        foreach ($users as $user) {
            $name = $user->first_name !== null && $user->last_name !== null
                ? $user->first_name . ' ' . $user->last_name
                : null;
            DB::table('users')->where('id', $user->id)->update(['name' => $name]);
        }

        Schema::table('users', function (Blueprint $table) {
            try { $table->dropUnique(['phone']); } catch (\Exception $e) {}
            try { $table->dropUnique(['username']); } catch (\Exception $e) {}
            
            $table->dropColumn(['first_name', 'last_name', 'username']);
            $table->string('name')->nullable(false)->change();
        });
    }
};
