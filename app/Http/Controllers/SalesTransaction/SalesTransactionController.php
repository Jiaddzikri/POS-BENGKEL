<?php

namespace App\Http\Controllers\SalesTransaction;

use App\Http\Controllers\Controller;
use App\Http\Resources\SalesTransactionResource;
use App\Http\Resources\TenantResource;
use App\Models\SalesTransaction;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class SalesTransactionController extends Controller
{

    public function salesTransaction(Request $request)
    {
        $user = auth()->user();

        $routeName = Route::currentRouteName();
        $search = $request->input('search');
        $page = $request->input('page');
        $filter = $request->input('filter');

        // Tambahkan filter tanggal
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $range = $request->input('range');

        $sales_transactions = SalesTransaction::with(['buyer', 'buyer.discount', 'tenant', 'details', 'details.item', 'details.variant'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $searchTerm = '%' . $search . '%';
                    $q->where('invoice_number', 'like', $searchTerm)
                        ->orWhereHas('buyer', function ($buyerQuery) use ($searchTerm) {
                            $buyerQuery->where('name', 'like', $searchTerm)
                                ->orWhere('phone_number', 'like', $searchTerm);
                        });
                });
            })
            ->when($filter, function ($query, $filter) {
                $query->where('tenant_id', $filter);
            })
            ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->when($user->role !== 'super_admin', function ($query) use ($user) {
                $query->where('tenant_id', '=', $user->tenant->id);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $tenants = Tenant::where('is_deleted', false)->latest()->get();

        return Inertia::render('sales-transaction', [
            'route_name' => $routeName,
            'sales_transactions' => SalesTransactionResource::collection($sales_transactions),
            'tenants' => $user->role !== 'super_admin' ? '' : TenantResource::collection($tenants)->resolve(),
            'filters' => [
                'page' => $page,
                'filter' => $filter,
                'search' => $search,
            ],
            'date' => [
                'startDate' => $startDate,
                'endDate' => $endDate,
                'range' => $range
            ]
        ]);
    }
}
