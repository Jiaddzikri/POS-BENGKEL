<?php

namespace App\Http\Controllers\Item;

use App\Http\Controllers\Controller;
use App\Http\Requests\Item\PostItemRequest;
use App\Http\Resources\VariantItemResource;
use App\Models\Category;
use App\Models\Item;
use App\Models\VariantItem;
use App\Request\PostItemAttributeRequest;
use App\Request\VariantAttributeRequest;
use App\Service\Item\ItemService;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ItemController extends Controller
{

    public function __construct(private ItemService $itemService)
    {

    }

    public function showItem(Request $request)
    {
        $tenantId = auth()->user()->tenant_id;
        $search = $request->input('search');
        $page = $request->input('page');

        $activeItemsCount = Item::where('tenant_id', $tenantId)->where('status', "active")->count();
        $lowStockCount = VariantItem::whereHas('item', function ($q) use ($tenantId) {
            $q->where('tenant_id', $tenantId);
        })->whereColumn('stock', '<=', 'minimum_stock')->count();
        $categoriesCount = Category::where('tenant_id', $tenantId)->count();

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
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('item', [
            "items" => VariantItemResource::collection($variants),
            "stats" => [
                'total' => $variants->count(),
                'active_items' => $activeItemsCount,
                'low_stock' => $lowStockCount,
                'categories' => $categoriesCount
            ],

            "filters" => ["search" => $search, 'page' => $page]
        ]);
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
            $itemRequest->image = $request->file("image");
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

            return redirect()->route('items.add')->with('success', 'Item berhasil ditambahkan!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'an internal server error');
        }
    }
}