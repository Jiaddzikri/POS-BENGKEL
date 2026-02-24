<?php

namespace App\Request;

class AdjustStockRequest
{
  public string $itemId;
  public string $adjusmentType;
  public int $quantity;
}