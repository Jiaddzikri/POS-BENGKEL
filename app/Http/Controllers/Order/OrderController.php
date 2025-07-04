<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\VariantItemResource;
use App\Models\Category;
use App\Models\ItemRecord;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\VariantItem;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;


class OrderController extends Controller
{
  public function createOrder(Request $request)
  {
    $user = $request->user();


    try {
      $order = DB::transaction(function () use ($user) {
        $newOrder = Order::create([
          "user_id" => $user->id,
          "tenant_id" => $user->tenant_id,
          "order_status" => "processing",

        ]);

        return $newOrder;
      });

      return redirect()
        ->route("menu", ["orderId" => $order->id])
        ->with('success', 'Order successfully created!');

    } catch (\Throwable $e) {
      return back()
        ->with('error', 'There was a problem creating your order. Please try again.')
        ->withInput();
    }
  }
  public function index(Request $request)
  {
    $tenantId = $request->user()->tenant_id;
    $search = $request->input("search");

    $categories = Category::query()->select(["id", "name"])->where('tenant_id', $tenantId)->limit(4)->get();

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

    return Inertia::render("order", [
      "items" => VariantItemResource::collection($variants),
      "categories" => $categories

    ]);
  }

  public function processOrder(Request $request, string $orderId)
  {
    try {
      $order = Order::findOrFail($orderId);
      $orderItems = $request->post("items");

      $order = DB::transaction(function () use ($orderItems, $order) {
        $totalAmount = 0;
        $finalAmount = 0;
        foreach ($orderItems as $orderItem) {

          $totalAmount += $orderItem["price_at_sale"] * $orderItem["quantity"];

          OrderItem::create([
            "order_id" => $order->id,
            "item_id" => $orderItem["item_id"],
            "variant_item_id" => $orderItem["variant_item_id"],
            "quantity" => $orderItem["quantity"],
            "price_at_sale" => $orderItem["price_at_sale"]
          ]);
          $findVariantItem = VariantItem::where("id", $orderItem["variant_item_id"]);

          $findVariantItem->update([
            "stock" => $findVariantItem->first()->stock - $orderItem["quantity"]
          ]);

          ItemRecord::create([
            "variant_item_id" => $orderItem["variant_item_id"],
            "stock_record" => $findVariantItem->first()->stock,
            "stock_out" => $orderItem["quantity"]
          ]);
        }
        Order::where("id", $order->id)->update([
          "total_amount" => $totalAmount,
          "order_status" => "completed"
        ]);

      });
      return redirect()->route('menu', ["orderId" => $orderId])->with("success", "success");
    } catch (\Exception $error) {
      dd($error->getMessage());
      return redirect()->back()->with("error", $error->getMessage());

    }
  }

}