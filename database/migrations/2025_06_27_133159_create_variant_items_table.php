<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('variant_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('item_id')->constrained('items')->onDelete('cascade');
            $table->string('name')->comment('e.g., Merah, XL');
            $table->string('sku')->unique()->comment('Stock Keeping Unit');
            $table->integer('stock')->default(0);
            $table->decimal('additional_price', 15, 2)->default(0)->comment('Harga tambahan untuk varian ini');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('variant_items');
    }
};