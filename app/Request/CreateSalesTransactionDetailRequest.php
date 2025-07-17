<?php

namespace App\Request;

class CreateSalesTransactionDetailRequest
{
  public string $salesTransactionId;
  public string $itemId;
  public string $variantItemId;
  public int $quantity;
  public int $priceAtSale;
  public int $subTotal;
}