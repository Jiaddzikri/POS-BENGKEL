<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * FLAT PRODUCT MODEL — merge variant_items into items.
 *
 * Strategy:
 *  - Add sku, stock, minimum_stock to items (all previously on variant_items).
 *  - price already exists on items (selling_price). We keep selling_price as-is.
 *  - order_items: add item_id_flat (points to items) to allow future direct FK;
 *    keep variant_item_id nullable so historical records don't break.
 *  - sales_transaction_details: same pattern — variant_id kept nullable.
 *  - variant_items table is NOT dropped in this migration to preserve history.
 *    A future cleanup migration can drop it after data verification.
 */
return new class extends Migration {
  public function up(): void
  {
    // ── 1. Add flat fields to items ──────────────────────────────────────
    Schema::table('items', function (Blueprint $table) {
      $table->string('sku')->nullable()->unique()->after('part_number')
        ->comment('SKU unik per item (flat model)');
      $table->unsignedInteger('stock')->default(0)->after('sku')
        ->comment('Stok saat ini');
      $table->unsignedInteger('minimum_stock')->default(0)->after('stock')
        ->comment('Batas minimum stok untuk alert');
    });

    // ── 2. Make variant_item_id nullable on order_items ──────────────────
    //    (so new orders can be created without a variant row)
    Schema::table('order_items', function (Blueprint $table) {
      $table->foreignUuid('variant_item_id')->nullable()->change();
    });

    // ── 3. Make variant_id nullable on sales_transaction_details ─────────
    Schema::table('sales_transaction_details', function (Blueprint $table) {
      $table->foreignUuid('variant_id')->nullable()->change();
    });
  }

  public function down(): void
  {
    Schema::table('sales_transaction_details', function (Blueprint $table) {
      $table->foreignUuid('variant_id')->nullable(false)->change();
    });

    Schema::table('order_items', function (Blueprint $table) {
      $table->foreignUuid('variant_item_id')->nullable(false)->change();
    });

    Schema::table('items', function (Blueprint $table) {
      $table->dropColumn(['sku', 'stock', 'minimum_stock']);
    });
  }
};
