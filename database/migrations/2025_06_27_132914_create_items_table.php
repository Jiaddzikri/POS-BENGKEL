<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->onDelete('cascade');
            $table->foreignUuid('category_id')->constrained('categories')->onDelete('restrict');
            $table->string('name');
            $table->json('gallery')->nullable()->comment('Menyimpan path gambar dalam format JSON');
            $table->text('description')->nullable();
            $table->string('brand')->nullable();
            $table->decimal('purchase_price', 15, 2)->default(0)->comment('Harga Beli');
            $table->decimal('purchase_sell', 15, 2)->default(0)->comment('Harga Jual');
            $table->string('status')->default('active'); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};