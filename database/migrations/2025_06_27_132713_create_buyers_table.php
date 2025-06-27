<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('buyers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('discount_id')->nullable()->constrained('discounts')->onDelete('set null');
            $table->string('name');
            $table->string('phone_number')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('buyers');
    }
};