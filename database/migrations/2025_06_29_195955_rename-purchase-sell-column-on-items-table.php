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
        Schema::table("items", function(Blueprint $table) {
            $table->renameColumn("purchase_sell", "selling_price");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("items", function(Blueprint $table) {
            $table->renameColumn("selling_price", "purchase_sell");
        });
    }
};
