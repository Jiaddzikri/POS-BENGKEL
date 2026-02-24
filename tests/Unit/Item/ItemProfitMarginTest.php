<?php

namespace Tests\Unit\Item;

use App\Models\Item;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class ItemProfitMarginTest extends TestCase
{
  private function makeItem(float $purchasePrice): Item
  {
    $item = new Item();
    $item->purchase_price = $purchasePrice;

    return $item;
  }

  #[Test]
  public function it_calculates_profit_margin_correctly(): void
  {
    $item = $this->makeItem(80_000);

    // (100_000 - 80_000) / 100_000 * 100 = 20.00
    $this->assertEquals(20.00, $item->calculateProfitMargin(100_000));
  }

  #[Test]
  public function it_returns_zero_when_price_is_zero(): void
  {
    $item = $this->makeItem(50_000);

    $this->assertEquals(0.0, $item->calculateProfitMargin(0));
  }

  #[Test]
  public function it_returns_zero_when_price_is_null(): void
  {
    $item = $this->makeItem(50_000);

    $this->assertEquals(0.0, $item->calculateProfitMargin(null));
  }

  #[Test]
  public function it_returns_negative_margin_when_selling_below_cost(): void
  {
    $item = $this->makeItem(100_000);

    // (80_000 - 100_000) / 80_000 * 100 = -25.00
    $this->assertEquals(-25.00, $item->calculateProfitMargin(80_000));
  }

  #[Test]
  public function it_returns_100_percent_margin_when_purchase_price_is_zero(): void
  {
    $item = $this->makeItem(0);

    // (50_000 - 0) / 50_000 * 100 = 100.00
    $this->assertEquals(100.00, $item->calculateProfitMargin(50_000));
  }

  #[Test]
  public function it_rounds_margin_to_two_decimal_places(): void
  {
    $item = $this->makeItem(33_000);

    // (100_000 - 33_000) / 100_000 * 100 = 67.00 exactly
    $this->assertEquals(67.00, $item->calculateProfitMargin(100_000));

    // (100_000 - 66_667) / 100_000 * 100 = 33.333 -> 33.33
    $item2 = $this->makeItem(66_667);
    $this->assertEquals(33.33, $item2->calculateProfitMargin(100_000));
  }
}
