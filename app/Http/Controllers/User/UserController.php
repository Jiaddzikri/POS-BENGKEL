<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\TenantResource;
use App\Http\Resources\UserResource;
use App\Models\Tenant;
use App\Models\User;
use App\Service\User\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class UserController extends Controller
{

    public function __construct(private UserService $userService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $routeName = Route::currentRouteName();
        $search = $request->input('search');
        $page = $request->input('page');
        $filter = $request->input('filter');

        $tenants = Tenant::where('is_deleted', false)->latest()->get();

        $users = User::with('tenant')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $searchTerm = '%' . $search . '%';
                    $q->where('name', 'like ', $searchTerm);
                });
            })
            ->when($filter, function ($query, $filter) {
                $query->where('tenant_id', $filter);
            })
            ->where('is_deleted', false)
            ->latest()
            ->paginate(10)
            ->withQueryString();


        return Inertia::render('user', [
            'route_name' => $routeName,
            'tenants' => TenantResource::collection($tenants)->resolve(),
            'users' => UserResource::collection($users),
            'filters' => [
                'search' => $search,
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
        $roleEnums = get_enum_values('users', 'role');
        $tenants = Tenant::where('is_deleted', false)->latest()->get();

        return Inertia::render(
            'user/action/add-user',
            [
                'roles' => $roleEnums,
                'tenants' => $tenants
            ]
        );
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
    public function edit(User $user)
    {
        $roleEnums = get_enum_values('users', 'role');
        $tenants = Tenant::where('is_deleted', false)->latest()->get();

        return Inertia::render(
            'user/action/update-user',
            [
                'user' => $user,
                'roles' => $roleEnums,
                'tenants' => $tenants,
            ]

        );
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
        try {
            $this->userService->delete($id);
        } catch (\Exception $e) {
            dd($e);
            return redirect()->back()->with('error', 'an internal server error');
        }
    }
}
