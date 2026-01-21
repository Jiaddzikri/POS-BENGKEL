<?php

namespace App\Request;

class DiscountAttributeRequest
{
  public string $name;
  public ?string $desc;
  public int $discount_percent;
  public ?bool $active;
  public ?string $tenant_id;
}