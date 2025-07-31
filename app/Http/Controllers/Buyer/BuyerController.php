<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Buyer\BuyerRequestValidator;
use App\Http\Resources\BuyerResource;
use App\Http\Resources\DiscountResource;
use App\Http\Resources\TenantResource;
use App\Models\Buyer;
use App\Models\Discount;
use App\Models\Tenant;
use App\Request\CreateBuyerRequest;
use App\Service\Buyer\BuyerService;
use GuzzleHttp\Promise\Create;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class BuyerController extends Controller
{
    public function __construct(private BuyerService $buyerService) {}

    public function findBuyerByPhone(Request $request)
    {
        $phone = $request->get('phone_number');

        try {
            $buyer = $this->buyerService->findBuyerByPhone($phone);

            if ($buyer === null) {
                throw new \Exception("Buyer not found", 404);
            }

            return response()->json(
                $buyer,
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


    public function index(Request $request)
    {

        $search = $request->input('search');
        $page = $request->input('page');
        $filter = $request->input('filter');

        $routeName = Route::currentRouteName();

        $tenants = Tenant::latest()->get()->where('is_deleted', false);
        $disounts = Discount::latest()->get();

        $buyers = Buyer::with('tenant', 'discount')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $searchTerm = '%' . $search . '%';
                    $q->where('name', 'like', $searchTerm)
                        ->orWhereHas('tenant', function ($tenantQuery) use ($searchTerm) {
                            $tenantQuery->where('name', 'like', $searchTerm);
                        });
                });
            })
            ->when($filter, function ($query, $filter) {
                $query->where('tenant_id', $filter);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('buyer', [
            'route_name' => $routeName,
            'buyers' => BuyerResource::collection($buyers),
            'tenants' => TenantResource::collection($tenants),
            'discounts' => DiscountResource::collection($disounts),
            'filters' => [
                "search" => $search,
                'page' => $page,
                'filter' => $filter
            ]
        ]);
    }

    public function edit(Buyer $buyer)
    {
        $tenants = Tenant::latest()->get();

        return Inertia::render('buyer/action/update-buyer', [
            'buyer' => $buyer,
            'tenants' => TenantResource::collection($tenants)->resolve()
        ]);
    }

    public function update(BuyerRequestValidator $request, string $id)
    {

        try {
            $request->validated();

            $buyerRequest = new CreateBuyerRequest();
            $buyerRequest->name = $request->post('name');
            $buyerRequest->phoneNumber = $request->post('phone_number');
            $buyerRequest->tenantId = $request->post('tenant_id');

            $this->buyerService->update($buyerRequest, $id);

            return redirect()->route('buyer.index')->with('success', 'Buyer berhasil di ubah');
        } catch (\Exception $e) {
            dd($e);
            return redirect()->back()->with('error', 'an internal server error');
        }
    }
}
