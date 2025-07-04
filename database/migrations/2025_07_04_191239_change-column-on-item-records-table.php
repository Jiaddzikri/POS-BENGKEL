<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table("item_records", function (Blueprint $table) {
            $table->integer("stock_out")->nullable()->default(0)->change();
            $table->integer("stock_in")->nullable()->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("item_records", function (Blueprint $table) {
            $table->integer("stock_id");
            $table->integer("stock_in");
        });
    }
};
