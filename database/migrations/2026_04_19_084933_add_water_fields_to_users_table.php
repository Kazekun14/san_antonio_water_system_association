<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add after 'name'
            $table->string('account_number', 50)->unique()->after('name');
            $table->string('address')->after('account_number');
            $table->string('phone', 20)->after('address');

            // Email is already on the users table from Breeze — make nullable
            // if some residents may not have an email. Remove the line below
            // if you want email to always be required.
            // $table->string('email')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['account_number', 'address', 'phone']);
        });
    }
};