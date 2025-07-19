<?php

namespace App\Http\Controllers\Tenant;

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
use Inertia\Inertia;

class TenantController extends Controller
{


    public function __construct(private TenantService $tenantService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $tenantsItems = DB::table('tenants')
            ->where('is_deleted', false)
            ->latest('created_at')
            ->get();

        return Inertia::render('tenant', [
            'tenants' => TenantResource::collection($tenantsItems)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $statusEnums = get_enum_values('tenants', 'status');

        return Inertia::render('tenant/action-tenant/add-tenant', [
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
        } catch (\Exception $e) {
            dd($e);
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

        return Inertia::render('tenant/action-tenant/update-tenant', [
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
        } catch (\Exception $e) {
            dd($e);
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
        } catch (\Exception $e) {
            dd($e);
            return redirect()->back()->with('error', 'an internal server error');
        }
    }
}
