<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Flat product model: item_records now tracks stock movements against items directly.
   * Add nullable item_id FK so new adjustments store item_id instead of variant_item_id.
   */
  public function up(): void
  {
    Schema::table('item_records', function (Blueprint $table) {
      $table->foreignUuid('item_id')
        ->nullable()
        ->after('variant_item_id')
        ->constrained('items')
        ->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::table('item_records', function (Blueprint $table) {
      $table->dropForeign(['item_id']);
      $table->dropColumn('item_id');
    });
  }
};
