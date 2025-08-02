<?php

namespace App\Http\Controllers\Item;

use App\Http\Controllers\Controller;
use App\Http\Requests\Item\PostItemRequest;
use App\Http\Resources\TenantResource;
use App\Http\Resources\VariantItemResource;
use App\Models\Category;
use App\Models\Item;
use App\Models\Tenant;
use App\Models\VariantItem;
use App\Request\PostItemAttributeRequest;
use App\Request\UpdateItemRequest;
use App\Request\VariantAttributeRequest;
use App\Service\Item\ItemService;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


class ItemController extends Controller
{

    public function __construct(private ItemService $itemService) {}

    public function showItem(Request $request)
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

            $activeItemsCount = Item::where(['tenant_id' => $tenantId])->where('status', "active")->count();
            $lowStockCount = VariantItem::whereHas('item', function ($q) use ($tenantId) {
                $q->where('tenant_id', $tenantId);
                $q->where('is_deleted', false);
            })->whereColumn('stock', '<=', 'minimum_stock')->count();
            $categories = Category::select(['categories.id', 'categories.name', 'tenants.name as tenant_name'])->leftJoin('tenants', 'categories.tenant_id', '=', 'tenants.id')->where('tenant_id', $tenantId)->get();

            $query = VariantItem::query()
                ->select([
                    'variant_items.*',
                    'items.name',
                    'categories.name'
                ])
                ->join('items', 'variant_items.item_id', '=', 'items.id')
                ->leftJoin('categories', 'items.category_id', '=', 'categories.id')
                ->where('items.tenant_id', $tenantId)
                ->where('variant_items.is_deleted', false);

            if ($search) {
                $searchTerm = '%' . $search . '%';
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('variant_items.sku', 'like', $searchTerm)
                        ->orWhere('variant_items.name', 'like', $searchTerm)
                        ->orWhere('items.name', 'like', $searchTerm)
                        ->orWhere('categories.name', 'like', $searchTerm);
                });
            }

            if ($category) {
                $query->where('categories.id', $category);
            }
            if ($minPrice) {
                $query->whereRaw('items.selling_price + variant_items.additional_price >= ?', [$minPrice]);
            }

            if ($maxPrice) {
                $query->whereRaw('items.selling_price + variant_items.additional_price <= ?', [$maxPrice]);
            }



            switch ($sortBy) {
                case 'name':
                    $query->orderBy('variant_items.name', $sortOrder);
                    break;
                case 'price':
                    $query->orderByRaw('items.selling_price + variant_items.additional_price' . $sortOrder);
                    break;
                case 'updated_at':
                    $query->orderBy('variant_items.updated_at', $sortOrder);
                    break;
                default:
                    $query->orderBy('variant_items.created_at', $sortOrder);
            }

            $variants = $query->paginate(10)->withQueryString();


            $variants->load(['item.category']);
            return Inertia::render('item', [
                "items" => VariantItemResource::collection($variants),
                "stats" => [
                    'total' => $variants->count(),
                    'active_items' => $activeItemsCount,
                    'low_stock' => $lowStockCount,
                    'categories' => $categories->count()
                ],
                'categories' => $categories,
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
        } catch (Exception $error) {
            dd($error->getMessage());
        }
    }

    public function addItem(Request $request)
    {
        $tenantId = $request->user()->tenant_id;

        $categories = Category::query()->when($tenantId, function ($query, $tenant) {
            $query->where('tenant_id', $tenant);
        })->get();

        return Inertia::render('item/add-item', [
            "categories" => $categories
        ]);
    }

    public function postItem(PostItemRequest $request)
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
        } catch (Exception $e) {
            dd($e->getMessage());
            return redirect()->back()->with('error', 'an internal server error');
        }
    }

    public function updateItemPage(Request $request, string $itemId)
    {
        $tenantId = $request->user()->tenant_id;

        $categories = Category::query()->when($tenantId, function ($query, $tenant) {
            $query->where('tenant_id', $tenant);
        })->get();

        $item = Item::with([
            'variants' => function ($query) {
                $query->where("is_deleted", false);
            },
            'category' => function ($query) {
                $query->select('id', 'name as category_name');
            }
        ])
            ->where('tenant_id', $tenantId)
            ->where('id', $itemId)
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

    public function putUpdateItem(\App\Http\Requests\Item\UpdateItemRequest $request, string $itemId)
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
            $itemRequest->new_image = $request->file("new_image", null);
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
            return redirect()->route('item.update.page', [
                "itemId" => $itemId
            ])->with('success', 'Item berhasil ditambahkan!');
        } catch (Exception $error) {
            dd($error);
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
        } catch (Exception $error) {
            return response()->json([
                "message" => $error->getMessage(),

            ], $error->getCode());
        }
    }

    public function deleteItem(Request $request, string $itemId)
    {
        try {
            DB::transaction(function () use ($itemId) {
                Item::where('id', '=', $itemId)->update([
                    "is_deleted" => true
                ]);

                VariantItem::where('item_id', '=', $itemId)->update([
                    'is_deleted' => true
                ]);
            });

            return redirect()->back()->with('success', 'item berhasil dihapus');
        } catch (Exception $error) {
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
