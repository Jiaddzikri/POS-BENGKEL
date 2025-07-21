<?php

namespace App\Response;

class GetRevenueResponse
{
  public ?int $revenue = 0;
  public ?string $trend = 'stable';
  public ?int $percentage = 0;
}