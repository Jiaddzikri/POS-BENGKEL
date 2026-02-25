<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Add movement_type to item_records so each stock record knows WHY
   * the stock changed: sold (order), added (stock-in), adjusted (correction),
   * or removed (manual deduction).
   */
  public function up(): void
  {
    Schema::table('item_records', function (Blueprint $table) {
      $table->enum('movement_type', ['sold', 'added', 'adjusted', 'removed'])
        ->default('adjusted')
        ->after('stock_out')
        ->comment('sold=order completed, added=stock in, adjusted=stock correction, removed=manual deduction');
    });
  }

  public function down(): void
  {
    Schema::table('item_records', function (Blueprint $table) {
      $table->dropColumn('movement_type');
    });
  }
};
