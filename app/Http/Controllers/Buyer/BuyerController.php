<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Buyer;
use App\Request\CreateBuyerRequest;
use App\Service\Buyer\BuyerService;
use GuzzleHttp\Promise\Create;
use Illuminate\Http\Request;

class BuyerController extends Controller
{
    public function __construct(private BuyerService $buyerService)
    {


    }

    public function findBuyerByPhone(Request $request)
    {
        $phone = $request->get('phone_number');

        try {
            $buyer = $this->buyerService->findBuyerByPhone($phone);

            return response()->json(
                $buyer
                ,
                200
            );
        } catch (\Exception $err) {

            return response()->json([
                'error' => $err->getMessage()
            ], $err->getCode());
        }
    }

    public function createBuyer(Request $request)
    {
        $data = new CreateBuyerRequest();
        $data->tenantId = $request->user()->tenant_id;
        $data->discountId = $request->post('discount_id');
        $data->phoneNumber = $request->post('phone_number');
        $data->name = $request->post('name');

        try {
            $buyer = $this->buyerService->createBuyer($data);

            return response()->json([
                'buyer' => $buyer
            ], 201);
        } catch (\Exception $err) {
            return response()->json([
                'error' => $err->getMessage()
            ], $err->getCode());
        }
    }
}
