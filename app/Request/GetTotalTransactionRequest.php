<?php

namespace App\Request;

class GetTotalTransactionRequest
{
  public ?string $tenantId;
  public ?string $range;
}