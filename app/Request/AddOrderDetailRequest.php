<?php

namespace App\Request;

class AddOrderDetailRequest
{
  public ?string $orderId = null;
  public ?string $itemId = null;
  public ?string $variantItemId = null;
  public ?int $quantity = 0;
  public ?int $priceAtSale = 0;
}