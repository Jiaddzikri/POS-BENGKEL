<?php

namespace App\Request;
class PostItemAttributeRequest
{
  public string $tenant_id;
  public string $name;
  public string $desciption;
  public string $category_id;
  public int $selling_price;
  public int $purchase_price;
  public string $brand;
  public array $variants;

  public $image;
}