<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignUuid('item_id')->constrained('items')->onDelete('restrict');
            $table->foreignUuid('variant_item_id')->constrained('variant_items')->onDelete('restrict');
            $table->integer('quantity');
            $table->decimal('price_at_sale', 15, 2)->comment('Harga produk saat order dibuat');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};