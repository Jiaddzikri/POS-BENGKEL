<?php

namespace App\Http\Controllers\Variant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Variant\StoreVariantItemRequest;
use App\Models\VariantItem;
use DB;

class VariantController extends Controller
{
    public function post(StoreVariantItemRequest $request, string $itemId)
    {
        try {
            $request->validated();

            DB::transaction(function () use ($request, $itemId) {
                VariantItem::create([
                    'item_id' => $itemId,
                    "sku" => $request->post('sku'),
                    'name' => $request->post('name'),
                    'additional_price' => $request->post('additional_price'),
                    'minimum_stock' => $request->post('minimum_stock'),
                    'stock' => $request->post('stock')
                ]);
            });

            return redirect()->route('item.update.page', ["itemId" => $itemId])->with('success', 'variant item successfully added');

        } catch (\Exception $e) {
            return redirect()->back()->with("error", 'an internal server error');
        }
    }

    public function delete(string $itemId, string $variantId)
    {
        try {
            DB::transaction(function () use ($variantId) {
                $variantItem = VariantItem::findOrFail($variantId);

                $variantItem->update([
                    "is_deleted" => true
                ]);

            });

            return redirect()->route('item.update.page', ["itemId" => $itemId])->with('success', 'variant item successfully added');

        } catch (\Exception $error) {


            return redirect()->back()->with("error", 'an internal server error');
        }
    }
}
