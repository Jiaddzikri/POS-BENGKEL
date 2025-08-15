<?php

namespace App\Http\Controllers\Invetory;

use App\Helpers\AppLog;
use App\Http\Controllers\Controller;
use App\Http\Resources\ItemRecordResource;
use App\Http\Resources\VariantItemResource;
use App\Request\AdjustStockRequest;
use App\Service\Inventory\InventoryService;
use Carbon\Carbon;
use Throwable;
use App\Service\Item\ItemService;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function __construct(private InventoryService $inventoryService, private ItemService $itemService)
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

        $activeItemsCount = $this->itemService->getActiveItemCount($tenantId);
        $lowStockCount = $this->itemService->getLowStockCount($tenantId);

        $outOfStock = $this->itemService->getOutOfStockCount($tenantId);

        $stockMovement = $this->inventoryService->getStockMovementCount($tenantId, [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'searchStockMovement' => $searchStockMovement
        ]);

        $variants = $this->itemService->getPaginatedVariants($tenantId, [
            'search' => $search,
            'page' => $page,
            'stockCondition' => $stockCondition
        ]);

        $stockMovements = $this->inventoryService->getStockMovementPaginated($tenantId, [
            'searchStockMovement' => $searchStockMovement,
            'startDate' => $startDate,
            'endDate' => $endDate
        ]);

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

        $activeItemsCount = $this->itemService->getActiveItemCount($tenantId);
        $lowStockCount = $this->itemService->getLowStockCount($tenantId);
        $outOfStock = $this->itemService->getOutOfStockCount($tenantId);

        $stockMovement = $this->inventoryService->getStockMovementPaginated($tenantId, [
            'searchStockMovement' => $searchStockMovement,
            'startDate' => $startDate,
            'endDate' => $endDate
        ]);
        $stats = [
            'active_item' => $activeItemsCount,
            'low_stock' => $lowStockCount,
            'out_of_stock' => $outOfStock,
            'stock_movement' => $stockMovement
        ];

        if ($exportType === 'inventory') {
            $variants = $this->itemService->getPaginatedVariants($tenantId, [
                'search' => $search,
                'stockCondition' => $stockCondition
            ]);

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
            $stockMovements = $this->inventoryService->getStockMovementPaginated($tenantId, [
                'searchStockMovement' => $searchStockMovement,
                'startDate' => $startDate,
                'endDate' => $endDate
            ]);

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
