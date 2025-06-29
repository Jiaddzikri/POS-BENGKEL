<?php

namespace App\Request;

class VariantAttributeRequest {
  public string $name;
  public string $sku;
  public int $stock;
  public int $additional_price;
  public int $minimum_stock;
}