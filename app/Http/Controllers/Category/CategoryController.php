<?php

namespace App\Http\Controllers\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\CategoryRequestValidator;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\TenantResource;
use App\Models\Category;
use App\Models\Tenant;
use App\Request\CategoryAttributeRequest;
use App\Service\Category\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class CategoryController extends Controller
{

    public function __construct(private CategoryService $categoryService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $user = auth()->user();

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
            ->where('tenant_id', '=', $user->tenant->id)
            ->where('is_deleted', false)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $tenants = Tenant::latest()->get();


        return Inertia::render('category', [
            'route_name' => $routeName,
            'categories' => CategoryResource::collection($categories),
            'tenants' => $user->tenant->id !== 'super_admin' ? '' : TenantResource::collection($tenants),
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
        $user = auth()->user();

        $tenants = Tenant::latest()->get();

        return Inertia::render('category/action/add-category', [
            'tenants' => $user->role !== 'super_admin' ? '' : $tenants
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequestValidator $request)
    {
        try {

            $user = auth()->user();

            $request->validated();

            $categoryRequest = new CategoryAttributeRequest();

            $categoryRequest->name = $request->post('name');

            if ($user->role === 'super_admin') {
                $categoryRequest->tenant_id = $request->post('tenant_id');
            } else {
                $categoryRequest->tenant_id = $user->tenant->id;
            }


            $this->categoryService->store($categoryRequest);

            return redirect()->route('category.index')->with('success', 'Category berhasil di buat');
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
    public function edit(Category $category)
    {
        $tenants = Tenant::latest()->get();

        return Inertia::render('category/action/update-category', [
            'category' => $category,
            'tenants' => TenantResource::collection($tenants)->resolve()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequestValidator $request, string $id)
    {
        try {

            $user = auth()->user();

            $request->validated();

            $categoryRequest = new CategoryAttributeRequest();
            $categoryRequest->name = $request->post('name');

            if ($user->role === 'super_admin') {
                $categoryRequest->tenant_id = $request->post('tenant_id');
            } else {
                $categoryRequest->tenant_id = $user->tenant->id;
            }

            $this->categoryService->update($categoryRequest, $id);

            return redirect()->route('category.index')->with('success', 'Category berhasil di ubah');
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
            $this->categoryService->delete($id);

            return redirect()->route('category.index')->with('success', 'Category berhasil di hapus');
        } catch (\Exception $e) {
            dd($e);
            return redirect()->back()->with('error', 'an internal server error');
        }
    }
}
