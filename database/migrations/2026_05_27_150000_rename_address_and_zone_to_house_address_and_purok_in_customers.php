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
        Schema::table('customers', function (Blueprint $table) {
            if (Schema::hasColumn('customers', 'address') && !Schema::hasColumn('customers', 'house_address')) {
                $table->renameColumn('address', 'house_address');
            }
            if (Schema::hasColumn('customers', 'zone') && !Schema::hasColumn('customers', 'purok')) {
                $table->renameColumn('zone', 'purok');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            if (Schema::hasColumn('customers', 'house_address') && !Schema::hasColumn('customers', 'address')) {
                $table->renameColumn('house_address', 'address');
            }
            if (Schema::hasColumn('customers', 'purok') && !Schema::hasColumn('customers', 'zone')) {
                $table->renameColumn('purok', 'zone');
            }
        });
    }
};
