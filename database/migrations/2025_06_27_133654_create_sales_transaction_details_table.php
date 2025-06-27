<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_transaction_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('sales_transaction_id')->constrained('sales_transactions')->onDelete('cascade');
            $table->foreignUuid('item_id')->constrained('items')->onDelete('restrict');
            $table->foreignUuid('variant_id')->constrained('variant_items')->onDelete('restrict');
            $table->integer('quantity');
            $table->decimal('price_at_sale', 15, 2);
            $table->decimal('sub_total', 15, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_transaction_details');
    }
};