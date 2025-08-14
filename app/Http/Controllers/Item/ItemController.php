<?php

namespace App\Http\Controllers\Item;

use App\Helpers\AppLog;
use App\Http\Controllers\Controller;
use App\Http\Requests\Item\PostItemRequest;
use App\Http\Resources\VariantItemResource;
use App\Models\Item;
use App\Models\VariantItem;
use App\Request\PostItemAttributeRequest;
use App\Request\UpdateItemRequest;
use App\Request\VariantAttributeRequest;
use App\Service\Category\CategoryService;
use App\Service\Item\ItemService;
use DB;
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

            $activeItemsCount = $this->itemService->getActiveItemCount($tenantId);
            $lowStockCount = $this->itemService->getLowStockCount($tenantId);
            $countCategories = $this->categoryService->countAllCategories($tenantId);

            $variants = $this->itemService->getPaginatedVariants($tenantId, [
                "search" => $search,
                'minPrice' => $minPrice,
                'maxPrice' => $maxPrice,
                'sortOrder' => $sortOrder,
                'sortBy' => $sortBy,
                'category' => $category

            ]);
            return Inertia::render('item', [
                "items" => VariantItemResource::collection($variants),
                "stats" => [
                    'total' => $variants->count(),
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

            $itemRequest = new PostItemAttributeRequest();
            $itemRequest->name = $request->post("name");
            $itemRequest->category_id = $request->post("category_id");
            $itemRequest->desciption = $request->post("description");
            $itemRequest->selling_price = (int) $request->post("selling_price");
            $itemRequest->purchase_price = (int) $request->post("purchase_price");
            $itemRequest->brand = $request->post("brand");
            $itemRequest->tenant_id = $tenantId;
            $variants = $request->post("variants");


            foreach ($variants as $variant) {
                $variantRequest = new VariantAttributeRequest();
                $variantRequest->name = $variant["name"];
                $variantRequest->additional_price = (int) $variant["additional_price"];
                $variantRequest->minimum_stock = (int) $variant["minimum_stock"];
                $variantRequest->stock = (int) $variant["stock"];
                $variantRequest->sku = $variant["sku"];

                $itemRequest->variants[] = $variantRequest;
            }

            $this->itemService->store($itemRequest);

            return redirect()->route('item.add')->with('success', 'Item berhasil ditambahkan!');
        } catch (Throwable $e) {
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
            'variants' => function ($query) {
                $query->where("is_deleted", false);
            },
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
            "variants" => $item->variants,

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
            $variants = $request->post("variants", []);

            if (sizeof($variants) > 0) {
                foreach ($variants as $variant) {
                    $variantRequest = new VariantAttributeRequest();
                    $variantRequest->id = $variant["id"];
                    $variantRequest->name = $variant["name"];
                    $variantRequest->additional_price = (int) $variant["additional_price"];
                    $variantRequest->minimum_stock = (int) $variant["minimum_stock"];
                    $variantRequest->stock = (int) $variant["stock"];
                    $variantRequest->sku = $variant["sku"];

                    $itemRequest->variants[] = $variantRequest;
                }
            } else {
                $itemRequest->variants = [];
            }



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
            $variants = VariantItem::with('item.category')
                ->where('is_deleted', false)
                ->whereHas('item', function ($query) use ($tenantId) {
                    $query->where('tenant_id', $tenantId);
                })->where('sku', $request->get('sku', null))->first();

            $resource = new VariantItemResource($variants);

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
            DB::transaction(function () use ($item) {
                Item::where('id', '=', $item)->update([
                    "is_deleted" => true
                ]);

                VariantItem::where('item_id', '=', $item)->update([
                    'is_deleted' => true
                ]);
            });

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
}
