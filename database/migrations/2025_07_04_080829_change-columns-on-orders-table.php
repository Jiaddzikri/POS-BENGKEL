<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table("orders", function (Blueprint $table) {
            $table->decimal('total_amount')->nullable()->default(0)->change();
            $table->decimal('final_amount')->nullable()->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('total_amount')->nullable(false)->change();
            $table->decimal('final_amount')->nullable(false)->change();
        });
    }
};
