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

        Schema::table('discounts', function (Blueprint $table) {
            $table->boolean("is_deleted")->nullable()->default(false);
            $table->integer('discount_percent')->comment('DIscount dalam persen')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discounts', function (Blueprint $table) {
            $table->drop('is_deleted');
            $table->decimal('discount_percent', 5, 2)->comment('Discount dalam persen')->change();
        });
    }
};
