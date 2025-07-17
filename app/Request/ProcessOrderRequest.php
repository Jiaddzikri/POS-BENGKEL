<?php

namespace App\Request;

class ProcessOrderRequest
{
  public string $orderId;

  public string $buyerId;

  public array $orderItems;

  public array $payment;
}