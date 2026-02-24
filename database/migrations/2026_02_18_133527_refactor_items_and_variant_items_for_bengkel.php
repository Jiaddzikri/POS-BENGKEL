<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   *
   * Perubahan:
   * - items: tambah part_number (unique), uom, rack_location, compatibility (json)
   * - variant_items: ganti additional_price -> price (harga jual absolut per varian)
   */
  public function up(): void
  {
    // 1. Tambah kolom baru ke tabel items
    Schema::table('items', function (Blueprint $table) {
      $table->string('part_number')->nullable()->unique()->after('brand')
        ->comment('Nomor part / kode suku cadang unik');
      $table->enum('uom', ['Pcs', 'Liter', 'Set', 'Box'])->default('Pcs')->after('part_number')
        ->comment('Unit of Measurement');
      $table->string('rack_location')->nullable()->after('uom')
        ->comment('Lokasi fisik di gudang/rak');
      $table->json('compatibility')->nullable()->after('rack_location')
        ->comment('Daftar merk/tipe motor yang kompatibel');
    });

    // 2. Ganti additional_price -> price (fixed selling price per varian)
    Schema::table('variant_items', function (Blueprint $table) {
      $table->renameColumn('additional_price', 'price');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('variant_items', function (Blueprint $table) {
      $table->renameColumn('price', 'additional_price');
    });

    Schema::table('items', function (Blueprint $table) {
      $table->dropColumn(['part_number', 'uom', 'rack_location', 'compatibility']);
    });
  }
};
