<?php

namespace App\Request;

class ProcessOrderRequest
{
  public string $orderId;

  public string $buyerId;
  public string $userId;

  public array $payment;

  public int $discount;
}