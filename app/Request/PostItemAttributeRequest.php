<?php

namespace App\Request;

class PostItemAttributeRequest
{
  public ?string $tenant_id;
  public string $name;
  public string $desciption;
  public string $category_id;
  public int $selling_price;
  public int $purchase_price;
  public string $brand;
  // Flat-product fields
  public ?string $part_number = null;
  public ?string $sku = null;
  public int $stock = 0;
  public int $minimum_stock = 0;
  public string $uom = 'Pcs';
  public ?string $rack_location = null;
  public array $compatibility = [];
  /** @deprecated no longer used */
  public array $variants = [];
}
