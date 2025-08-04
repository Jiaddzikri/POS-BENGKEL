<?php

namespace App\Response;

class GetCompletedTransactionResponse
{
  public int $total;
  public int $percentage;
  public string $trend;
}