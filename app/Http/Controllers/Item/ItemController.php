<?php

namespace App\Http\Controllers\Item;

use App\Http\Controllers\Controller;
use App\Http\Requests\Item\PostItemRequest;
use App\Models\Category;
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