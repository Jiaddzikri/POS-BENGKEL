<?php

namespace App\Http\Controllers\Discount;

use App\Helpers\AppLog;
use App\Http\Controllers\Controller;
use App\Http\Requests\Discount\DiscountRequestValidator;
use App\Http\Requests\Discount\DiscountActiveRequestValidator;
use App\Http\Resources\DiscountResource;
use App\Http\Resources\TenantResource;
use App\Models\Discount;
use App\Models\Tenant;
use App\Request\DiscountAttributeRequest;
use App\Service\Discount\DiscountService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class DiscountController extends Controller
{

    public function __construct(private DiscountService $discountService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $routeName = Route::currentRouteName();

        $search = $request->input('search');
        $page = $request->input('page');
        $filter  = $request->input('filter');

        $discounts = Discount::with('tenant')
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
            ->where('is_deleted', false)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $tenants = Tenant::latest()->get()->where('is_deleted', false);



        return Inertia::render('discount', [
            'route_name' => $routeName,
            'filters' => [
                'search' => $search,
                'page' => $page,
                'filter' => $filter
            ],
            'tenants' => TenantResource::collection($tenants),
            'discounts' => DiscountResource::collection($discounts)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $tenants = Tenant::latest()->get()->where('is_deleted', false);

        return Inertia::render('discount/action/add-discount', [
            'tenants' => TenantResource::collection($tenants)->resolve()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DiscountRequestValidator $request)
    {
        try {

            $request->validated();

            $discountRequest = new DiscountAttributeRequest();

            $discountRequest->name = $request->input('name');
            $discountRequest->desc = $request->input('desc');
            $discountRequest->discount_percent = $request->input('discount_percent');
            $discountRequest->tenant_id = $request->input('tenant_id');


            $this->discountService->store($discountRequest);

            return redirect()->route('discount.index')->with('success', 'Diskon berhasil di buat');
        } catch (\Throwable $e) {
            // dd($e);
            AppLog::execption($e);
            return redirect()->back()->with('error', 'an internal server error');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Discount $discount)
    {
        $tenants = Tenant::latest()->get()->where('is_deleted', false);

        return Inertia::render('discount/action/update-discount', [
            'discount' => $discount,
            'tenants' => TenantResource::collection($tenants)->resolve()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DiscountRequestValidator $request, string $id)
    {
        try {

            $request->validated();

            $discountRequest = new DiscountAttributeRequest();

            $discountRequest->name = $request->input('name');
            $discountRequest->desc = $request->input('desc');
            $discountRequest->discount_percent = $request->input('discount_percent');
            $discountRequest->tenant_id = $request->input('tenant_id');

            $this->discountService->update($discountRequest, $id);

            return redirect()->route('discount.index')->with('success', 'Diskon berhasil di buat');
        } catch (\Throwable $e) {
            // dd($e);
            AppLog::execption($e);
            return redirect()->back()->with('error', 'an internal server error');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $this->discountService->delete($id);

            return redirect()->route('discount.index')->with('success', 'Discount berhasil di hapus');
        } catch (\Throwable $e) {
            // dd($e);
            AppLog::execption($e);
            return redirect()->back()->with('error', 'an internal server error');
        }
    }


    public function updateStatusActive(DiscountActiveRequestValidator $request, string $id)
    {
        try {


            $request->validated();

            $discountActiveRequest = new DiscountAttributeRequest();

            $discountActiveRequest->active = $request->post('active');

            $this->discountService->updateActive($discountActiveRequest, $id);

            return redirect()->route('discount.index')->with('success', "Status discount telah di ubah.");
        } catch (\Throwable $e) {
            // dd($e);
            AppLog::execption($e);
            return redirect()->back()->with('error', 'an internal server error');
        }
    }
}
