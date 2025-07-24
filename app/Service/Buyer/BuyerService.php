<?php

namespace App\Service\Buyer;

use App\Models\Buyer;
use App\Request\CreateBuyerRequest;
use DB;

class BuyerService
{
  public function createBuyer(CreateBuyerRequest $data)
  {
    return Buyer::create([
      'tenant_id' => $data->tenantId,
      'discount_id' => $data->discountId,
      'phone_number' => $data->phoneNumber,
      'name' => $data->name,
    ]);
  }

  public function findBuyerByPhone(string $phoneNumber)
  {
    return Buyer::where('phone_number', $phoneNumber)
      ->with('discount')
      ->first();
  }
}