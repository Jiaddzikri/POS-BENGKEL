<?php

namespace App\Response;

class GetTotalTransactionResponse
{
  public ?int $total = 0;
  public ?string $trend = 'stable';
  public ?int $percentage = 0;
}