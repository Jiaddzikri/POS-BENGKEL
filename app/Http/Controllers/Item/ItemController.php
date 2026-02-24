<?php

namespace App\Http\Controllers\Item;

use App\Helpers\AppLog;
use App\Http\Controllers\Controller;
use App\Http\Requests\Item\PostItemRequest;
use App\Http\Resources\ItemResource;
use App\Http\Resources\VariantItemResource;
use App\Models\Item;
use App\Request\PostItemAttributeRequest;
use App\Request\UpdateItemRequest;
use App\Service\Category\CategoryService;
use App\Service\Item\ItemService;
use Throwable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;


class ItemController extends Controller
{

  public function __construct(private ItemService $itemService, private CategoryService $categoryService)
  {
  }

  public function index(Request $request)
  {
    $tenantId = auth()->user()->tenant_id ?? $request->get('tenant_id');
    $search = $request->input('search');
    $page = $request->input('page', 1);
    $minPrice = $request->get('minPrice');
    $maxPrice = $request->get('maxPrice');
    $sortOrder = $request->get('sortOrder', 'desc');
    $sortBy = $request->get('sortBy', 'created_at');
    $category = $request->get('category');

    try {

      $itemCount = $this->itemService->getItemCount($tenantId);
      $activeItemsCount = $this->itemService->getActiveItemCount($tenantId);
      $lowStockCount = $this->itemService->getLowStockCount($tenantId);
      $countCategories = $this->categoryService->countAllCategories($tenantId);

      $items = $this->itemService->getPaginatedItems($tenantId, [
        "search" => $search,
        'minPrice' => $minPrice,
        'maxPrice' => $maxPrice,
        'sortOrder' => $sortOrder,
        'sortBy' => $sortBy,
        'category' => $category
      ]);

      return Inertia::render('item', [
        'items' => ItemResource::collection($items),
        "stats" => [
          'total' => $itemCount,
          'active_items' => $activeItemsCount,
          'low_stock' => $lowStockCount,
          'categories' => $countCategories
        ],
        "filters" => [
          "search" => $search,
          'page' => $page,
          'category' => $category,
          'minPrice' => $minPrice ? (float) $minPrice : null,
          'maxPrice' => $maxPrice ? (float) $maxPrice : null,
          'sortBy' => $sortBy,
          'sortOrder' => $sortOrder,
        ],
        'tenant_id' => $tenantId
      ]);
    } catch (Throwable $error) {
      // dd($error->getMessage());
      AppLog::execption($error);
    }
  }

  public function create(Request $request)
  {
    $tenantId = $request->user()->tenant_id;

    if (!$tenantId) {
      return redirect()->route('item.index')->with('error', 'Tenant ID is required. Please contact administrator.');
    }

    $categories = $this->categoryService->selectAllCategories($tenantId);

    return Inertia::render('item/add-item', [
      "categories" => $categories
    ]);
  }
  public function store(PostItemRequest $request)
  {
    try {
      $request->validated();
      $tenantId = $request->user()->tenant_id;

      if (!$tenantId) {
        return redirect()->back()->with('error', 'Tenant ID is required. Please ensure you are assigned to a tenant.');
      }

      $itemRequest = new PostItemAttributeRequest();
      $itemRequest->name = $request->post("name");
      $itemRequest->category_id = $request->post("category_id");
      $itemRequest->desciption = $request->post("description");
      $itemRequest->selling_price = (int) $request->post("selling_price");
      $itemRequest->purchase_price = (int) $request->post("purchase_price");
      $itemRequest->brand = $request->post("brand");
      $itemRequest->tenant_id = $tenantId;
      // Bengkel-specific fields
      $itemRequest->part_number = $request->post("part_number");
      $itemRequest->uom = $request->post("uom", "Pcs");
      $itemRequest->rack_location = $request->post("rack_location");
      $itemRequest->compatibility = $request->post("compatibility", []);
      // Flat product fields
      $itemRequest->sku = $request->post("sku");
      $itemRequest->stock = (int) $request->post("stock", 0);
      $itemRequest->minimum_stock = (int) $request->post("minimum_stock", 0);

      $this->itemService->store($itemRequest);

      return redirect()->route('item.create')->with('success', 'Item berhasil ditambahkan!');
    } catch (Throwable $e) {
      Log::error("Error storing item: " . $e->getMessage());
      // dd($e->getMessage());
      AppLog::execption($e);
      return redirect()->back()->with('error', 'an internal server error');
    }
  }

  public function edit(Request $request, string $item)
  {
    $tenantId = $request->user()->tenant_id;

    $categories = $this->categoryService->selectAllCategories($tenantId);
    $item = Item::with([
      'category' => function ($query) {
        $query->select('id', 'name as category_name');
      }
    ])
      ->where('tenant_id', $tenantId)
      ->where('id', $item)
      ->first();

    $mapItem = [
      "brand" => $item->brand,
      "id" => $item->id,
      "category_id" => $item->category->id,
      "category_name" => $item->category->category_name,
      "item_name" => $item->name,
      "purchase_price" => $item->purchase_price,
      "selling_price" => $item->selling_price,
      "image_path" => $item->image_path,
      "description" => $item->description,
      "is_active" => $item->status === "active",
      "status" => $item->status,
      "part_number" => $item->part_number,
      "uom" => $item->uom ?? 'Pcs',
      "rack_location" => $item->rack_location,
      "compatibility" => $item->compatibility ?? [],
      // Flat product fields
      "sku" => $item->sku,
      "stock" => (int) ($item->stock ?? 0),
      "minimum_stock" => (int) ($item->minimum_stock ?? 0),
    ];

    return Inertia::render('item/update-item', [
      "categories" => $categories,
      "item" => $mapItem
    ]);
  }

  public function update(\App\Http\Requests\Item\UpdateItemRequest $request, string $itemId)
  {
    try {
      $request->validated();

      $tenantId = $request->user()->tenant_id;

      $itemRequest = new UpdateItemRequest();
      $itemRequest->name = $request->post("item_name");
      $itemRequest->category_id = $request->post("category_id");
      $itemRequest->description = $request->post("description");
      $itemRequest->selling_price = (int) $request->post("selling_price");
      $itemRequest->purchase_price = (int) $request->post("purchase_price");
      $itemRequest->brand = $request->post("brand");
      $itemRequest->tenant_id = $tenantId;
      $itemRequest->status = $request->post('status');
      // Bengkel-specific fields
      $itemRequest->part_number = $request->post("part_number");
      $itemRequest->uom = $request->post("uom", "Pcs");
      $itemRequest->rack_location = $request->post("rack_location");
      $itemRequest->compatibility = $request->post("compatibility", []);
      // Flat product fields
      $itemRequest->sku = $request->post("sku");
      $itemRequest->stock = (int) $request->post("stock", 0);
      $itemRequest->minimum_stock = (int) $request->post("minimum_stock", 0);

      $this->itemService->update($itemRequest, $itemId);
      return redirect()->route('item.edit', [
        "item" => $itemId
      ])->with('success', 'Item berhasil diupdate!');
    } catch (Throwable $error) {
      // dd($error);
      AppLog::execption($error);
      return redirect()->back()->with('error', 'an internal server error');
    }
  }

  public function findItem(Request $request)
  {
    $tenantId = $request->user()->tenant_id;
    try {
      $item = Item::with('category')
        ->where('tenant_id', $tenantId)
        ->where('is_deleted', false)
        ->where('sku', $request->get('sku', null))
        ->first();

      $resource = new VariantItemResource($item);

      return response()->json([
        $resource
      ], 200);
    } catch (Throwable $error) {

      AppLog::execption($error);

      return response()->json([
        "message" => $error->getMessage(),

      ], $error->getCode());
    }
  }

  public function destroy(Request $request, string $item)
  {
    Log::info("Deleting item with ID: $item");
    try {
      Item::where('id', '=', $item)->update([
        "is_deleted" => true
      ]);

      return redirect()->back()->with('success', 'item berhasil dihapus');
    } catch (Throwable $error) {
      AppLog::execption($error);
      return redirect()->back()->with('error', $error->getMessage());
    }
  }


  // public function listSuper(Request $request)
  // {
  //     $routeName = Route::currentRouteName();
  //     $search = $request->input('search');
  //     $page = $request->input('page');
  //     $filter = $request->input('filter');

  //     $tenants = Tenant::when($search, function ($query, $search) {
  //         $query->where(function ($q) use ($search) {
  //             $searchTerm = '%' . $search . '%';
  //             $q->where('name', 'like', $searchTerm);
  //         });
  //     })
  //         ->when($filter, function ($query, $filter) {
  //             $query->where('status', $filter);
  //         })
  //         ->where('is_deleted', false)
  //         ->latest()
  //         ->paginate(10)
  //         ->withQueryString();

  //     $statusEnums = get_enum_values('tenants', 'status');

  //     return Inertia::render('super-list/super-list', [
  //         'route_name' => $routeName,
  //         'title' => 'Item',
  //         'bread_crumbs' => [
  //             [
  //                 'title' => 'Item',
  //                 'href' => 'item/list'
  //             ]
  //         ],
  //         'route' => 'item',
  //         'tenants' => TenantResource::collection($tenants),
  //         'status' => $statusEnums,
  //         'filters' => [
  //             'search' => $search,
  //             'page' => $page,
  //             'filter' => $filter,
  //         ]
  //     ]);
  // }

  // ── Import ──────────────────────────────────────────────────────────────

  /**
   * POST /item/import
   *
   * Accepts a multipart file (key: "file") and imports items from Excel / CSV.
   * Returns JSON: { total_rows, imported, created, updated, failed, errors[] }
   */
  public function importItem(Request $request)
  {
    $tenantId = auth()->user()->tenant_id ?? $request->get('tenant_id');

    $request->validate([
      'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'],
    ], [
      'file.required' => 'File tidak boleh kosong.',
      'file.mimes' => 'Format file harus .xlsx, .xls, atau .csv.',
      'file.max' => 'Ukuran file maksimal 10 MB.',
    ]);

    try {
      $result = $this->itemService->importFromExcel($request->file('file'), $tenantId);

      return response()->json([
        'message' => $result->failed === 0
          ? "Import selesai. {$result->imported} item berhasil diimport."
          : "Import selesai dengan {$result->failed} error.",
        'data' => $result->toArray(),
      ], $result->imported > 0 || $result->failed === 0 ? 200 : 422);

    } catch (Throwable $error) {
      AppLog::execption($error);
      return response()->json([
        'message' => 'Terjadi kesalahan saat memproses file.',
        'error' => $error->getMessage(),
      ], 500);
    }
  }

  /**
   * GET /item/import/template
   *
   * Download a blank Excel template that matches the required import columns.
   */
  public function downloadImportTemplate()
  {
    return \Maatwebsite\Excel\Facades\Excel::download(
      new \App\Exports\ItemImportTemplateExport(),
      'template-import-barang.xlsx'
    );
  }
}
