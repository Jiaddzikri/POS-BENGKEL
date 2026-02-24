<?php

namespace App\Response;

class GetDeadStockResponse
{
  /** @var \Illuminate\Support\Collection */
  public $items;
  public int $total = 0;

  public function __construct()
  {
    $this->items = collect();
  }
}
