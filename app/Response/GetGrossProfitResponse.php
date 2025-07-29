<?php

namespace App\Response;

class GetGrossProfitResponse
{
  public ?int $grossProfit = 0;
  public ?string $trend = 'stable';
  public ?int $percentage = 0;
}