<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('water_rates', function (Blueprint $table) {
            $table->id();
            $table->decimal('base_rate', 10, 2)->default(200.00);
            $table->decimal('rate_per_cubic_meter', 10, 2)->default(15.00);
            $table->decimal('penalty_amount', 10, 2)->default(50.00);
            $table->unsignedTinyInteger('billing_cycle_day')->default(1); // day of month
            $table->string('barangay_name')->default('Barangay San Antonio');
            $table->string('barangay_address')->default('San Antonio, Philippines');
            $table->string('contact_number')->default('N/A');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('water_rates');
    }
};
