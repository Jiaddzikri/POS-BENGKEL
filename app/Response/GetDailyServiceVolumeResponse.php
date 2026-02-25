<?php

namespace App\Response;

class GetDailyServiceVolumeResponse
{
  /** @var array<array{date: string, count: int}> */
  public array $data = [];
  public int $total = 0;
  public string $trend = 'stable';
  public float $percentage = 0.0;
}
