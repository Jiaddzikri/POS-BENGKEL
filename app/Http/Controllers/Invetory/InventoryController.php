<?php

namespace App\Http\Controllers\Invetory;

use App\Helpers\AppLog;
use App\Http\Controllers\Controller;
use App\Http\Resources\ItemRecordResource;
use App\Http\Resources\VariantItemResource;
use App\Models\Item;
use App\Models\ItemRecord;
use App\Models\VariantItem;
use App\Request\AdjustStockRequest;
use App\Service\Inventory\InventoryService;
use Carbon\Carbon;
use Throwable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function __construct(private InventoryService $inventoryService)
    {

    }
    public function index(Request $request)
    {
        $tenantId = auth()->user()->tenant_id;
        $search = $request->input('search', null);
        $page = $request->input('page', 1);
        $searchStockMovement = $request->input('search_stock_movement', null);
        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);
        $stockCondition = $request->input('stock_condition', null);

        $activeItemsCount = Item::where('tenant_id', $tenantId)->where('status', "active")->count();
        $lowStockCount = VariantItem::whereHas('item', function ($q) use ($tenantId) {
            $q->where('tenant_id', $tenantId);
            $q->where('is_deleted', false);
        })->whereColumn('stock', '<=', 'minimum_stock')->count();

        $outOfStock = VariantItem::whereHas('item', function ($q) use ($tenantId) {
            $q->where('tenant_id', $tenantId);
            $q->where('is_deleted', false);
        })->where('stock', '=', 0)->count();

        $stockMovement = ItemRecord::whereHas('variant', function ($q) use ($tenantId) {
            $q->whereHas('item', function ($qu) use ($tenantId) {
                $qu->where('tenant_id', $tenantId);
                $qu->where('is_deleted', false);
            });

        })->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])->count();

        $variants = VariantItem::with('item.category')
            ->whereHas('item', function ($query) use ($tenantId) {
                $query->where('tenant_id', $tenantId);
            })
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $searchTerm = '%' . $search . '%';
                    $q->where('sku', 'like', $searchTerm)
                        ->orWhere('name', 'like', $searchTerm)
                        ->orWhereHas('item', function ($itemQuery) use ($searchTerm) {
                            $itemQuery->where('name', 'like', $searchTerm);
                        })
                        ->orWhereHas('item.category', function ($categoryQuery) use ($searchTerm) {
                            $categoryQuery->where('name', 'like', $searchTerm);
                        });
                });
            })->where(function ($query) use ($stockCondition) {
                $query->where('is_deleted', false);

                if ($stockCondition != null) {
                    switch ($stockCondition) {
                        case 'low':
                            $query->whereColumn('stock', '<=', 'minimum_stock');
                            break;
                        case 'normal':
                            $query->whereColumn('stock', '>', 'minimum_stock');
                            break;
                        case 'out_of_stock':
                            $query->where('stock', '=', 0);
                            break;
                    }

                }
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $stockMovements = ItemRecord::with('variant.item.category')
            ->whereHas('variant.item', function ($query) use ($tenantId) {
                $query->where('tenant_id', $tenantId)
                    ->where('is_deleted', false);
            })
            ->when($searchStockMovement, function ($query, $search) {
                $searchTerm = '%' . $search . '%';
                $query->where(function ($q) use ($searchTerm) {
                    $q->whereHas('variant', function ($variantQuery) use ($searchTerm) {
                        $variantQuery->where('sku', 'like', $searchTerm)
                            ->orWhere('name', 'like', $searchTerm);
                    })
                        ->orWhereHas('variant.item', function ($itemQuery) use ($searchTerm) {
                            $itemQuery->where('name', 'like', $searchTerm);
                        })
                        ->orWhereHas('variant.item.category', function ($categoryQuery) use ($searchTerm) {
                            $categoryQuery->where('name', 'like', $searchTerm);
                        });
                });
            })
            ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                $start = Carbon::parse($startDate)->startOfDay();
                $end = Carbon::parse($endDate)->endOfDay();
                return $query->whereBetween('created_at', [$start, $end]);
            })
            ->latest()
            ->paginate(10)->withQueryString();

        return Inertia::render('inventory', [
            "stats" => [
                'active_item' => $activeItemsCount,
                'low_stock' => $lowStockCount,
                'out_of_stock' => $outOfStock,
                'stock_movement' => $stockMovement
            ],
            'inventoryData' => VariantItemResource::collection($variants),
            'stockMovementData' => ItemRecordResource::collection($stockMovements),
            'filters' => [
                'page' => $page,
                'search' => $search,
                'startDate' => $startDate,
                'endDate' => $endDate
            ]
        ]);
    }

    public function adjustStock(Request $request)
    {
        $adjustStockRequest = new AdjustStockRequest();
        $adjustStockRequest->variantId = $request->post('variant_id');
        $adjustStockRequest->adjusmentType = $request->post('adjust_type');
        $adjustStockRequest->quantity = (int) $request->post('quantity');

        $response = $this->inventoryService->adjustStock($adjustStockRequest);

        try {
            return redirect()->route('inventory.index')->with('success', 'Stock Successfully Adjusted, new stock : ' . $response->stock);
        } catch (Throwable $e) {

            AppLog::execption($e);

            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function showPdfPreview(Request $request)
    {
        $tenantId = auth()->user()->tenant_id;
        $search = $request->input('search', null);
        $searchStockMovement = $request->input('search_stock_movement', null);
        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);
        $stockCondition = $request->input('stock_condition', null);
        $exportType = $request->input('export_type', 'inventory');

        $activeItemsCount = Item::where('tenant_id', $tenantId)->where('status', "active")->count();
        $lowStockCount = VariantItem::whereHas('item', function ($q) use ($tenantId) {
            $q->where('tenant_id', $tenantId);
            $q->where('is_deleted', false);
        })->whereColumn('stock', '<=', 'minimum_stock')->count();

        $outOfStock = VariantItem::whereHas('item', function ($q) use ($tenantId) {
            $q->where('tenant_id', $tenantId);
            $q->where('is_deleted', false);
        })->where('stock', '=', 0)->count();

        $stockMovement = ItemRecord::whereHas('variant', function ($q) use ($tenantId) {
            $q->whereHas('item', function ($qu) use ($tenantId) {
                $qu->where('tenant_id', $tenantId);
                $qu->where('is_deleted', false);
            });
        })->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])->count();

        $stats = [
            'active_item' => $activeItemsCount,
            'low_stock' => $lowStockCount,
            'out_of_stock' => $outOfStock,
            'stock_movement' => $stockMovement
        ];

        if ($exportType === 'inventory') {
            $variants = VariantItem::with('item.category')
                ->whereHas('item', function ($query) use ($tenantId) {
                    $query->where('tenant_id', $tenantId);
                })
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $searchTerm = '%' . $search . '%';
                        $q->where('sku', 'like', $searchTerm)
                            ->orWhere('name', 'like', $searchTerm)
                            ->orWhereHas('item', function ($itemQuery) use ($searchTerm) {
                                $itemQuery->where('name', 'like', $searchTerm);
                            })
                            ->orWhereHas('item.category', function ($categoryQuery) use ($searchTerm) {
                                $categoryQuery->where('name', 'like', $searchTerm);
                            });
                    });
                })->where(function ($query) use ($stockCondition) {
                    $query->where('is_deleted', false);

                    if ($stockCondition != null) {
                        switch ($stockCondition) {
                            case 'low':
                                $query->whereColumn('stock', '<=', 'minimum_stock');
                                break;
                            case 'normal':
                                $query->whereColumn('stock', '>', 'minimum_stock');
                                break;
                            case 'out_of_stock':
                                $query->where('stock', '=', 0);
                                break;
                        }
                    }
                })
                ->latest()
                ->get();

            return Inertia::render('reports/print-inventory', [
                'title' => 'Laporan Inventory',
                'stats' => $stats,
                'inventoryData' => VariantItemResource::collection($variants),
                'filters' => [
                    'search' => $search,
                    'stock_condition' => $stockCondition,
                    'start_date' => now()->format('d/m/Y H:i:s')
                ]
            ]);

        } else {
            $stockMovements = ItemRecord::with('variant.item.category')
                ->whereHas('variant.item', function ($query) use ($tenantId) {
                    $query->where('tenant_id', $tenantId)
                        ->where('is_deleted', false);
                })
                ->when($searchStockMovement, function ($query, $search) {
                    $searchTerm = '%' . $search . '%';
                    $query->where(function ($q) use ($searchTerm) {
                        $q->whereHas('variant', function ($variantQuery) use ($searchTerm) {
                            $variantQuery->where('sku', 'like', $searchTerm)
                                ->orWhere('name', 'like', $searchTerm);
                        })
                            ->orWhereHas('variant.item', function ($itemQuery) use ($searchTerm) {
                                $itemQuery->where('name', 'like', $searchTerm);
                            })
                            ->orWhereHas('variant.item.category', function ($categoryQuery) use ($searchTerm) {
                                $categoryQuery->where('name', 'like', $searchTerm);
                            });
                    });
                })
                ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                    $start = Carbon::parse($startDate)->startOfDay();
                    $end = Carbon::parse($endDate)->endOfDay();
                    return $query->whereBetween('created_at', [$start, $end]);
                })
                ->latest()
                ->get();

            return Inertia::render('reports/print-stock-movement', [
                'title' => 'Laporan Pergerakan Stok',

                'stockMovementData' => ItemRecordResource::collection($stockMovements),
                'filters' => [
                    'search' => $searchStockMovement,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'export_date' => now()->format('d/m/Y H:i:s')
                ]
            ]);
        }
    }

}
