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
    Schema::table('item_records', function (Blueprint $table) {
      // Flat product model: item_records no longer needs a variant row.
      // Drop the old FK, then re-add the column as nullable.
      $table->dropForeign(['variant_item_id']);
      $table->foreignUuid('variant_item_id')->nullable()->change();
      $table->foreign('variant_item_id')->references('id')->on('variant_items')->onDelete('set null');
    });
  }

  public function down(): void
  {
    Schema::table('item_records', function (Blueprint $table) {
      $table->dropForeign(['variant_item_id']);
      $table->foreignUuid('variant_item_id')->nullable(false)->change();
      $table->foreign('variant_item_id')->references('id')->on('variant_items')->onDelete('cascade');
    });
  }
};
