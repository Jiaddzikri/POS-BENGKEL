<?php

namespace App\Request;

class CreateSalesTransactionRequest
{
  public string $orderId;
  public string $tenantId;
  public string $buyerId;
  public string $invoiceNumber;
  public string $paymentMethod;
  public int $totalAmount;
  public int $finalAmount;
  public int $amountPaid;
  public int $change;
}