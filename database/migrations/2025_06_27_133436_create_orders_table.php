<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->onDelete('restrict');
            $table->foreignUuid('buyer_id')->constrained('buyers')->onDelete('restrict');
            $table->foreignUuid('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignUuid('discount_id')->nullable()->constrained('discounts')->onDelete('set null');
            $table->decimal('total_amount', 15, 2)->comment('Total sebelum diskon');
            $table->decimal('final_amount', 15, 2)->comment('Total setelah diskon');
            $table->enum('order_status', ['processing', 'awaiting_payment', 'completed', 'cancelled'])->default('processing');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};