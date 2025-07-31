<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\DiscountResource;
use App\Http\Resources\VariantItemResource;
use App\Models\Category;
use App\Models\Discount;
use App\Models\ItemRecord;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\SalesTransaction;
use App\Models\SalesTransactionDetail;
use App\Models\VariantItem;
use App\Request\CreateBuyerRequest;
use App\Request\CreateOrderRequest;
use App\Request\CreateReceiptRequest;
use App\Request\ProcessOrderRequest;
use App\Service\Buyer\BuyerService;
use App\Service\Order\OrderService;
use App\Service\Receipt\ReceiptService;
use App\Service\Transaction\TransactionService;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;


class OrderController extends Controller
{
  public function __construct(private OrderService $orderService, private TransactionService $transactionService, private BuyerService $buyerService, private ReceiptService $receiptService)
  {

  }
  public function createOrder(Request $request)
  {
    $user = $request->user();

    $createOrderRequest = new CreateOrderRequest();
    $createOrderRequest->userId = $user->id;
    $createOrderRequest->tenantId = $user->tenant_id;
    $createOrderRequest->status = 'processing';

    try {
      $order = $this->orderService->create($createOrderRequest);

      return redirect()
        ->route("menu", ["orderId" => $order->id])
        ->with('success', 'Order successfully created!');

    } catch (\Throwable $e) {
      return back()
        ->with('error', 'There was a problem creating your order. Please try again.')
        ->withInput();
    }
  }
  public function index(Request $request, string $orderId)
  {
    $tenantId = $request->user()->tenant_id;
    $search = $request->input("search");

    $orderStatus = Order::select('order_status')->where('id', '=', $orderId)->first();

    $isOrderCompleted = $orderStatus->order_status === 'completed';

    $categories = Category::query()->select(["id", "name"])->where('tenant_id', $tenantId)->limit(4)->get();

    $variants = VariantItem::with('item.category')
      ->where('is_deleted', false)
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

    $discounts = Discount::latest()->get();

    return Inertia::render("order", [
      "items" => VariantItemResource::collection($variants),
      "categories" => $categories,
      'discounts' => DiscountResource::collection($discounts),
      'isOrderCompleted' => $isOrderCompleted
    ]);
  }

  public function processOrder(Request $request, string $orderId)
  {
    try {

      $findBuyer = $this->buyerService->findBuyerByPhone($request->post("phone_number"));

      if (!$findBuyer) {
        $createBuyerRequest = new CreateBuyerRequest();
        $createBuyerRequest->tenantId = $request->user()->tenant_id;
        $createBuyerRequest->name = $request->post("name");
        $createBuyerRequest->phoneNumber = $request->post("phone_number");

        $findBuyer = $this->buyerService->createBuyer($createBuyerRequest);
      }

      $processOrderRequest = new ProcessOrderRequest();
      $processOrderRequest->orderId = $orderId;
      $processOrderRequest->buyerId = $findBuyer->id;
      $processOrderRequest->orderItems = $request->post("items");
      $processOrderRequest->payment = [
        "amount_paid" => (int) $request->post("amount_paid", 0),
        "payment_method" => $request->post('payment_method', 'cash')
      ];
      $processOrderRequest->discount = (int) $request->post('discount', 0);

      $this->orderService->processOrder($processOrderRequest);

      return redirect()->route('menu', ['orderId' => $orderId])->with(["success" => "pesanan berhasil diproses"]);
    } catch (\Exception $error) {
      return redirect()->back()->with("error", $error->getMessage());
    }
  }

}