<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->onDelete('restrict');
            $table->foreignUuid('buyer_id')->constrained('buyers')->onDelete('restrict');
            $table->string('name')->comment('Nama pembeli, bisa redundan tapi ada di skema');
            $table->string('invoice_number')->unique();
            $table->decimal('total_amount', 15, 2);
            $table->decimal('final_amount', 15, 2);
            $table->string('payment_method')->comment('e.g., cash, gopay');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_transactions');
    }
};