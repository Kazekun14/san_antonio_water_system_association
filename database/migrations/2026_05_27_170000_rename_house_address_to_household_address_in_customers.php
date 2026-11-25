<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            if (Schema::hasColumn('customers', 'house_address') && !Schema::hasColumn('customers', 'household_address')) {
                $table->renameColumn('house_address', 'household_address');
            }
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            if (Schema::hasColumn('customers', 'household_address') && !Schema::hasColumn('customers', 'house_address')) {
                $table->renameColumn('household_address', 'house_address');
            }
        });
    }
};
