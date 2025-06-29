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
        Schema::table("variant_items", function (Blueprint $table) {
            $table->integer('minimum_stock')->comment('jumlah minimum sebuah stok');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('variant_items', function (Blueprint $table) {
            $table->dropColumn('minimum_stock');
        });
    }
};
