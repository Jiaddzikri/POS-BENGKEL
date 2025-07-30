<?php

namespace App\Request;

class AdjustStockRequest
{
  public string $variantId;
  public string $adjusmentType;
  public int $quantity;
}