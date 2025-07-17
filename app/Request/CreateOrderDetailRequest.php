<?php

namespace App\Request;

class CreateOrderDetailRequest
{
  public string $orderId;
  public string $itemId;
  public string $variantId;
  public int $quantity;
  public int $priceAtSale;

}