<?php

namespace App\Http\Controllers\Tenant;

use App\Helpers\AppLog;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\PostTenatRequest;
use App\Http\Requests\Tenant\PutTenantRequest;
use App\Http\Requests\Tenant\TenantRequestValidator;
use App\Http\Resources\TenantResource;
use App\Models\Tenant;
use App\Request\PostTenantAttributeRequest;
use App\Request\PutTenantAttributeRequest;
use App\Request\TenantAttributeRequest;
use App\Service\Tenant\TenantService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class TenantController extends Controller
{


    public function __construct(private TenantService $tenantService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $routeName = Route::currentRouteName();
        $search = $request->input('search');
        $page = $request->input('page');
        $filter = $request->input('filter');

        $tenants = Tenant::when($search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $searchTerm = '%' . $search . '%';
                $q->where('name', 'like', $searchTerm);
            });
        })
            ->when($filter, function ($query, $filter) {
                $query->where('status', $filter);
            })
            ->where('is_deleted', false)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $statusEnums = get_enum_values('tenants', 'status');

        return Inertia::render('tenant', [
            'route_name' => $routeName,
            'tenants' => TenantResource::collection($tenants),
            'status' => $statusEnums,
            'filters' => [
                'search' => $search,
                'page' => $page,
                'filter' => $filter,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $statusEnums = get_enum_values('tenants', 'status');

        return Inertia::render('tenant/action/add-tenant', [
            'status' => $statusEnums,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TenantRequestValidator $request)
    {
        try {
            $request->validated();

            $tenantRequest = new TenantAttributeRequest();
            $tenantRequest->name = $request->post('name');
            $tenantRequest->status = $request->post('status');


            $this->tenantService->store($tenantRequest);


            return redirect()->route('tenant.index')->with('success', 'Toko berhasil di tambahkan');
        } catch (\Throwable $e) {
            // dd($e);
            AppLog::execption($e);
            return redirect()->back()->with('error', 'an internal server error');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tenant $tenant)
    {
        $statusEnums = get_enum_values('tenants', 'status');

        return Inertia::render('tenant/action/update-tenant', [
            'status' => $statusEnums,
            'tenant' => $tenant
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TenantRequestValidator $request, string $id)
    {
        try {

            $request->validated();

            $tenantRequest = new TenantAttributeRequest();
            $tenantRequest->name = $request->post('name');
            $tenantRequest->status = $request->post('status');

            $this->tenantService->update($tenantRequest, $id);

            return redirect()->route('tenant.index')->with('success', 'Toko berhasil di ubah');
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
            $this->tenantService->delete($id);

            return redirect()->route('tenant.index')->with('success', 'Toko berhasil di hapus');
        } catch (\Throwable $e) {
            // dd($e);

            AppLog::execption($e);

            return redirect()->back()->with('error', 'an internal server error');
        } 
    }
}
