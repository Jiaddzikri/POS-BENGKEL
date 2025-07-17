<?php

namespace App\Request;

class CreateOrderRequest
{
  public string $userId;
  public string $tenantId;
  public string $status;

}