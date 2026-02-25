<?php

namespace App\Request;

class VariantAttributeRequest
{
  public ?string $id = null;
  public string $name;
  public string $sku;
  public int $stock;
  public int $price;          // Harga Jual absolut per varian (bukan tambahan)
  public int $minimum_stock;
}
