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
        Schema::create('discount_usage_histories', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreignUuid('buyer_id')->references('id')->on('buyers')->onDelete('restrict');
            $table->foreignUuid('discount_id')->references('id')->on('discounts')->onDelete('restrict');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discount_usage_histories');
    }
};
