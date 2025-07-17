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
        Schema::table('sales_transactions', function (Blueprint $table) {
            $table->integer('amount_paid')->nullable()->default(0);
            $table->integer('change')->nullable()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales_transaction', function (Blueprint $table) {
            $table->dropColumn(['amount_paid', 'change']);
            $table->dropColumn(['change', 'change']);
        });
    }
};
