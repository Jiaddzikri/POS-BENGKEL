<?php

namespace App\Http\Controllers\Variant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Variant\StoreVariantItemRequest;
use App\Models\Item;
use App\Models\VariantItem;
use DB;
use Log;
use Request;

class VariantController extends Controller
{
    public function store(StoreVariantItemRequest $request, Item $item)
    {
        try {
            $request->validated();

            DB::transaction(function () use ($request, $item) {
                VariantItem::create([
                    'item_id' => $item->id,
                    "sku" => $request->post('sku'),
                    'name' => $request->post('name'),
                    'additional_price' => $request->post('additional_price'),
                    'minimum_stock' => $request->post('minimum_stock'),
                    'stock' => $request->post('stock')
                ]);
            });

            return redirect()->back()->with('success', 'variant item successfully added');
        } catch (\Exception $e) {
            return redirect()->back()->with("error", 'an internal server error');
        }
    }

    public function destroy(Request $request, Item $item, VariantItem $variant)
    {
        try {
            DB::transaction(function () use ($variant) {
                $variant->update([
                    "is_deleted" => true
                ]);
            });
            return redirect()->route('item.edit', ['item' => $item])->with('success', 'variant item successfully deleted');
        } catch (\Exception $error) {
            Log::error('error', ['message' => $error->getMessage(), 'trace' => $error->getTraceAsString()]);
            return redirect()->back()->with("error", 'an internal server error');
        }
    }
}
