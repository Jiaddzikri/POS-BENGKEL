<?php

namespace App\Request;

class GetAnalyticalRequest
{
  public ?string $range = null;
  public ?string $startDate = null;
  public ?string $endDate = null;
  public ?string $tenantId = null;
  /** 'online' | 'offline' | null (null = all) */
  public ?string $orderType = null;
}