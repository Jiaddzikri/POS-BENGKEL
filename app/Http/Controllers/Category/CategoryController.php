<?php

namespace App\Http\Controllers\Category;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\TenantResource;
use App\Models\Category;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $routeName = Route::currentRouteName();
        $search = $request->input('search');
        $page = $request->input('page');
        $filter = $request->input('filter');

        $categories = Category::with('tenant')
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

        $tenants = Tenant::latest()->get();


        return Inertia::render('category', [
            'route_name' => $routeName,
            'categories' => CategoryResource::collection($categories),
            'tenants' => TenantResource::collection($tenants),
            'filters' => [
                "search" => $search, 
                'page' => $page, 
                'filter' => $filter
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
