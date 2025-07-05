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
        Schema::table("orders", function (Blueprint $table) {
            $table->integer("total_amount")->nullable()->default(0)->change();
            $table->integer("final_amount")->nullable()->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("orders", function (Blueprint $table) {
            $table->decimal('total_amount', 15, 2)->comment('Total sebelum diskon')->change();
            $table->decimal('final_amount', 15, 2)->comment('Total setelah diskon')->change();
        });
    }
};
