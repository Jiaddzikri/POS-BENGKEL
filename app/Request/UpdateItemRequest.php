<?php

namespace App\Request;
class UpdateItemRequest
{
  public ?string $tenant_id;
  public string $name;
  public string $description;
  public string $category_id;
  public int $selling_price;
  public int $purchase_price;
  public string $brand;
  public string $status;
  public array $variants = [];

  public $new_image = null;
}