<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item_records', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('variant_item_id')->constrained('variant_items')->onDelete('cascade');
            $table->integer('stock_record')->comment('Jumlah stok yang berubah (+/-)');
            $table->integer('stock_in')->comment('Jumlah stok setelah perubahan');
            $table->integer('stock_out')->comment('Jumlah stok setelah perubahan');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_records');
    }
};