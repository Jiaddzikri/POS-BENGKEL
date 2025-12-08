<?php

namespace App\Request;

class DiscountUsageHistoryAttributeRequest
{
  public string $tenant_id;
  public string $buyer_id;
  public string $discount_id;
}
