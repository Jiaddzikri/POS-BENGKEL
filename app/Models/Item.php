<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
  use HasFactory, HasUuids;

  protected $table = "items";

  protected $fillable = [
    "tenant_id",
    "category_id",
    "name",
    "description",
    "brand",
    "purchase_price",
    "selling_price",
    "part_number",
    "sku",
    "stock",
    "minimum_stock",
    "uom",
    "rack_location",
    "compatibility",
    "status",
    'is_deleted',
  ];

  protected $casts = [
    'compatibility' => 'array',
    'stock' => 'integer',
    'minimum_stock' => 'integer',
  ];

  // ── Relations ──────────────────────────────────────────────────────────

  /**
   * Kept for historical FK reads (order_items, sales_transaction_details still
   * reference variant_items for old records).
   * @deprecated Use Item directly for all new logic.
   */
  public function variants(): HasMany
  {
    return $this->hasMany(VariantItem::class, 'item_id', 'id');
  }

  public function category(): BelongsTo
  {
    return $this->belongsTo(Category::class, 'category_id', 'id');
  }

  public function details(): HasMany
  {
    return $this->hasMany(SalesTransactionDetail::class);
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  public function isLowStock(): bool
  {
    return $this->stock <= $this->minimum_stock;
  }

  public function calculateProfitMargin(?float $price = null): float
  {
    $price = $price ?? (float) $this->selling_price;
    if (!$price || $price <= 0) {
      return 0.0;
    }

    return round((($price - (float) $this->purchase_price) / $price) * 100, 2);
  }
}
