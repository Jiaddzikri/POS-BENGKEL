<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserAddRequestValidator;
use App\Http\Requests\User\UserUpdateRequestValidator;
use App\Http\Resources\TenantResource;
use App\Http\Resources\UserResource;
use App\Models\Tenant;
use App\Models\User;
use App\Request\UserAttributeRequest;
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
    public function store(UserAddRequestValidator $request)
    {
        try {
            $request->validated();

            $userRequest = new UserAttributeRequest();
            $userRequest->name = $request->post('name');
            $userRequest->email = $request->post('email');
            $userRequest->password = $request->post('password');
            $userRequest->role = $request->post('role');
            $userRequest->tenant_id = $request->post('tenant_id');

            $user = $this->userService->store($userRequest);

            return redirect()->route('user.index')->with('success', 'Pengguna ' . $user->email . ' berhasil di tambahkan, sebagai ' . $user->role);
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
    public function edit(User $user)
    {
        $roleEnums = get_enum_values('users', 'role');
        $tenants = Tenant::where('is_deleted', false)->latest()->get();

        $routeName = Route::currentRouteName();

        return Inertia::render(
            'user/action/update-user',
            [
                'user' => $user,
                'roles' => $roleEnums,
                'tenants' => $tenants,
                'route_name' => $routeName
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequestValidator $request, string $id)
    {
        try {

            $request->validated();

            $userRequest = new UserAttributeRequest();

            $userRequest->name = $request->post('name');
            $userRequest->role = $request->post('role');

            if (is_null($request->input('tenant_id'))) {
                $userRequest->tenant_id = $request->post('tenant_id');
            }

            $user = $this->userService->update($userRequest, $id);

            return redirect()->route('user.index')->with('success', 'Mengubah pengguna ' . $user->email);
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
            $this->userService->delete($id);
        } catch (\Exception $e) {
            dd($e);
            return redirect()->back()->with('error', 'an internal server error');
        }
    }
}
