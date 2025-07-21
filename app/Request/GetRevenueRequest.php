<?php

namespace App\Request;

class GetRevenueRequest
{
  public ?string $startDate = null;
  public ?string $endDate = null;

  public ?string $range = null;

  public ?string $tenantId;
}