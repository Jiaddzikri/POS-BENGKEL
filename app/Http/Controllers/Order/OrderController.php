<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\DiscountResource;
use App\Http\Resources\OrderResource;
use App\Http\Resources\VariantItemResource;
use App\Models\Category;
use App\Models\Discount;
use App\Models\Order;
use App\Models\VariantItem;
use App\Request\CreateBuyerRequest;
use App\Request\CreateOrderRequest;
use App\Request\ProcessOrderRequest;
use App\Service\Buyer\BuyerService;
use App\Service\Order\OrderService;
use App\Service\Receipt\ReceiptService;
use App\Service\Transaction\TransactionService;
use Carbon\Carbon;
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

  public function orderHistory(Request $request)
  {
    $page = $request->get('page', 1);
    $startDate = $request->get('startDate');
    $endDate = $request->get('endDate');
    $search = $request->get('search');
    $status = $request->get('status');

    $tenantId = $request->user()->tenant_id;

    try {
      $baseQuery = Order::with([
        'user:id,name',
        'buyer:id,name,phone_number',
        'orderItem',
        'orderItem.item:id,name',
        'orderItem.variant:id,name,sku',
      ])
        ->where('tenant_id', $tenantId)
        ->when($status, function ($query, $status) {
          return $query->where('order_status', $status);
        })
        ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
          $start = Carbon::parse($startDate)->startOfDay();
          $end = Carbon::parse($endDate)->endOfDay();
          return $query->whereBetween('created_at', [$start, $end]);
        })
        ->when($search, function ($query, $search) {
          $searchTerm = '%' . $search . '%';
          return $query->where(function ($q) use ($searchTerm) {
            $q->where('id', 'like', $searchTerm)
              ->orWhereHas('user', function ($userQuery) use ($searchTerm) {
                $userQuery->where('name', 'like', $searchTerm);
              })
              ->orWhereHas('buyer', function ($buyerQuery) use ($searchTerm) {
                $buyerQuery->where('name', 'like', $searchTerm)
                  ->orWhere('phone_number', 'like', $searchTerm);
              });
          });
        });


      $orders = $baseQuery->latest()->paginate(10)->withQueryString();

      $resource = OrderResource::collection($orders);

      return Inertia::render('order-history', [
        'order_histories' => $resource,
        'filters' => [
          'page' => $page,
          'search' => $search,
          'startDate' => $startDate,
          'endDate' => $endDate,
          'status' => $status
        ]
      ]);

    } catch (\Exception $error) {
      return redirect()->back()->with('error', $error->getMessage());
    }
  }

}