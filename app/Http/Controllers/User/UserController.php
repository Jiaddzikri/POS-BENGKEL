<?php

namespace App\Http\Controllers\User;

use App\Helpers\AppLog;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserAddRequestValidator;
use App\Http\Requests\User\UserUpdateRequestValidator;
use App\Http\Resources\TenantResource;
use App\Http\Resources\UserResource;
use App\Models\Tenant;
use App\Models\User;
use App\Request\UserAttributeRequest;
use App\Service\Mail\MailService;
use App\Service\User\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class UserController extends Controller
{

    public function __construct(private UserService $userService, private MailService $verifyEmailService) {}

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

        $tenants = Tenant::where('is_deleted', false)->latest()->get();



        $users = User::with('tenant')
            ->when($user->role === 'admin', function ($query) {
                $query->where('role', '!=', 'super_admin');
            })
            ->when($user->role === 'manager', function ($query) {

                $query->whereNotIn('role', ['admin', 'manager']);
            })
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $searchTerm = '%' . $search . '%';
                    $q->where('name', 'like ', $searchTerm);
                });
            })
            ->when($filter, function ($query, $filter) {
                $query->where('tenant_id', $filter);
            })
            ->when($user->role !== 'super_admin', function ($query) use ($user) {
                $query->where('tenant_id', '=', $user->tenant->id);
            })
            ->where('id', '!=', $user->id)
            ->where('is_deleted', false)
            ->latest()
            ->paginate(10)
            ->withQueryString();


        return Inertia::render('user', [
            'route_name' => $routeName,
            'tenants' => $user->role !== 'super_admin' ? null : TenantResource::collection($tenants),
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

        $user = auth()->user();

        $roleEnums = get_enum_values('users', 'role');
        $tenants = Tenant::where('is_deleted', false)->latest()->get();

        $filterRoleByUser = filter_role_by_user($roleEnums, $user);


        return Inertia::render(
            'user/action/add-user',
            [
                'roles' => $filterRoleByUser,
                'tenants' => $user->role !== 'super_admin' ? null : $tenants
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserAddRequestValidator $request)
    {
        try {

            $userAuth = auth()->user();

            $request->validated();

            $userRequest = new UserAttributeRequest();
            $userRequest->name = $request->post('name');
            $userRequest->email = $request->post('email');
            $userRequest->password = $request->post('password');
            $userRequest->role = $request->post('role');

            if ($userAuth->role === 'super_admin') {
                $userRequest->tenant_id = $request->post('tenant_id');
            } else {
                $userRequest->tenant_id = $userAuth->tenant->id;
            }

            $user = $this->userService->store($userRequest);

            $this->verifyEmailService->sendVerifyEmail($user);



            return redirect()->route('user.index')->with('success', 'Pengguna ' . $user->email . ' berhasil di tambahkan, sebagai ' . $user->role);
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
    public function edit(User $user)
    {
        $routeName = Route::currentRouteName();

        // $userAuth = auth()->user();

        $roleEnums = get_enum_values('users', 'role');
        // $tenants = Tenant::where('is_deleted', false)->latest()->get();


        $filterRoleByUser = filter_role_by_user($roleEnums, $user);

        return Inertia::render(
            'user/action/update-user',
            [
                'user' => $user,
                'roles' => $filterRoleByUser,
                // 'tenants' => $user->role !== 'super_admin' ? null : $tenants,
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
            $userRequest->tenant_id = $request->post('tenant_id');

            // if (is_null($request->input('tenant_id'))) {
            //     $userRequest->tenant_id = $request->post('tenant_id');
            // }

            $user = $this->userService->update($userRequest, $id);

            return redirect()->route('user.index')->with('success', 'Mengubah pengguna ' . $user->email);
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
            $this->userService->delete($id);
        } catch (\Throwable $e) {
            // dd($e);
            AppLog::execption($e);
            return redirect()->back()->with('error', 'an internal server error');
        }
    }

    public function updateTenantForLogin(Request $request, string $id)
    {
        try {


            // dd($request->post('tenant_id'));

            $tenant_id = $request->post('tenant_id');

            // dd($tenant_id);

            $user = $this->userService->updateTenantId($id, $tenant_id);


            return redirect()->route('dashboard')->with('success', 'Sukses masuk ke ' . $user->tenant_id);
        } catch (\Throwable $e) {
            // dd($e);
            AppLog::execption($e);
            return redirect()->back()->with('error', 'an internal server error');
        }
    }

    public function logoutFromTenant(Request $request): RedirectResponse
    {

        try {

            $user = $request->user();

            $user->tenant_id = null;

            $user->save();


            return redirect()->route('tenant.index');
        } catch (\Throwable $e) {
            AppLog::execption($e);
            return redirect()->back()->with('error', 'an internal server error');
        }
    }
}
