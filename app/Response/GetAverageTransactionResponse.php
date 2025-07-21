<?php

namespace App\Response;

class GetAverageTransactionResponse
{
  public int $percentage;
  public string $trend;
  public int $averageValue;
}