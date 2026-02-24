<?php

namespace App\Http\Controllers\Order;

use App\Helpers\AppLog;
use App\Http\Controllers\Controller;
use App\Http\Resources\DiscountResource;
use App\Http\Resources\OrderItemResource;
use App\Http\Resources\OrderResource;
use App\Http\Resources\VariantItemResource;
use App\Models\Category;
use App\Models\Discount;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\VariantItem;
use App\Models\Item;
use App\Request\AddOrderDetailRequest;
use App\Request\CreateBuyerRequest;
use App\Request\CreateOrderRequest;
use App\Request\ProcessOrderRequest;
use App\Service\Buyer\BuyerService;
use App\Service\Order\OrderService;
use App\Service\Receipt\ReceiptService;
use App\Service\Transaction\TransactionService;
use Carbon\Carbon;
use DB;
use Throwable;
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

    try {
      // Reuse any existing 'processing' order for this user to prevent phantom orders
      // (e.g. from sidebar prefetch or multiple clicks)
      $existingOrder = Order::where('tenant_id', $user->tenant_id)
        ->where('user_id', $user->id)
        ->where('order_status', 'processing')
        ->latest()
        ->first();

      if ($existingOrder) {
        return redirect()->route("menu", ["orderId" => $existingOrder->id]);
      }

      $createOrderRequest = new CreateOrderRequest();
      $createOrderRequest->userId = $user->id;
      $createOrderRequest->tenantId = $user->tenant_id;
      $createOrderRequest->status = 'processing';

      $order = $this->orderService->create($createOrderRequest);

      return redirect()
        ->route("menu", ["orderId" => $order->id])
        ->with('success', 'Order successfully created!');
    } catch (\Throwable $e) {

      AppLog::execption($e);

      return back()
        ->with('error', 'There was a problem creating your order. Please try again.')
        ->withInput();
    }
  }

  public function reorder(Request $request, string $sourceOrderId)
  {
    $user = $request->user();

    try {
      DB::beginTransaction();

      // Create new blank order
      $createOrderRequest = new CreateOrderRequest();
      $createOrderRequest->userId = $user->id;
      $createOrderRequest->tenantId = $user->tenant_id;
      $createOrderRequest->status = 'processing';
      $newOrder = $this->orderService->create($createOrderRequest);

      // Copy items from old order using the latest variant price
      $oldItems = OrderItem::with('variant:id,price')->where('order_id', $sourceOrderId)->get();

      foreach ($oldItems as $oldItem) {
        $detailRequest = new AddOrderDetailRequest();
        $detailRequest->orderId = $newOrder->id;
        $detailRequest->itemId = $oldItem->item_id;
        $detailRequest->variantItemId = $oldItem->variant_item_id;
        $detailRequest->quantity = $oldItem->quantity;
        $detailRequest->priceAtSale = (int) ($oldItem->variant?->price ?? $oldItem->price_at_sale);

        $this->orderService->addOrderDetail($detailRequest);
      }

      DB::commit();

      return redirect()
        ->route('menu', ['orderId' => $newOrder->id])
        ->with('success', 'Order baru berhasil dibuat dari riwayat transaksi.');
    } catch (Throwable $e) {
      DB::rollBack();
      AppLog::execption($e);
      return redirect()->back()->with('error', $e->getMessage());
    }
  }
  public function index(Request $request, string $orderId)
  {
    $tenantId = $request->user()->tenant_id;
    $search = $request->input("search");

    $order = Order::select(['order_status', 'discount'])->where('id', '=', $orderId)->first();

    $isOrderCompleted = $order->order_status === 'completed';
    $isOrderHold = $order->order_status === 'awaiting_payment';
    $isOrderCancelled = $order->order_status === 'cancelled';
    $discount = $order->discount;

    $variants = Item::with('category')
      ->where('is_deleted', false)
      ->where('status', 'active')
      ->where('tenant_id', $tenantId)
      ->when($search, function ($query, $search) {
        $searchTerm = '%' . $search . '%';
        $query->where(function ($q) use ($searchTerm) {
          $q->where('name', 'like', $searchTerm)
            ->orWhere('part_number', 'like', $searchTerm)
            ->orWhere('sku', 'like', $searchTerm)
            ->orWhereHas('category', function ($c) use ($searchTerm) {
              $c->where('name', 'like', $searchTerm);
            });
        });
      })
      ->latest()
      ->paginate(100)
      ->withQueryString();

    $categories = Category::where('tenant_id', $tenantId)
      ->where('is_deleted', false)
      ->orderBy('name')
      ->get(['id', 'name']);

    $orderDetail = OrderItem::with(['item.category', 'variant'])->where('order_id', '=', $orderId)->get();

    return Inertia::render("order", [
      "items" => VariantItemResource::collection($variants),
      'categories' => $categories,
      'discount' => $discount,
      'isOrderCompleted' => $isOrderCompleted,
      'isOrderHold' => $isOrderHold,
      'isOrderCancelled' => $isOrderCancelled,
      'orderDetail' => OrderItemResource::collection($orderDetail)
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
      $processOrderRequest->userId = $request->user()->id;
      $processOrderRequest->payment = [
        "amount_paid" => (int) $request->post("amount_paid", 0),
        "payment_method" => $request->post('payment_method', 'cash')
      ];
      $processOrderRequest->discount = (int) $request->post('discount', 0);
      $processOrderRequest->orderType = $request->post('order_type', 'offline') ?? 'offline';

      $this->orderService->processOrder($processOrderRequest);

      return redirect()->route('menu', ['orderId' => $orderId])->with(["success" => "pesanan berhasil diproses"]);
    } catch (Throwable $error) {

      AppLog::execption($error);

      return redirect()->back()->with("error", $error->getMessage());
    }
  }

  public function addOrderDetail(Request $request, $orderId)
  {
    try {
      $detailRequest = new AddOrderDetailRequest();
      $detailRequest->orderId = $orderId;
      $detailRequest->itemId = $request->post('item_id');
      $detailRequest->variantItemId = $request->post('variant_id');
      $detailRequest->quantity = (int) $request->post('quantity');
      $detailRequest->priceAtSale = (int) $request->post('price_at_sale');

      $this->orderService->addOrderDetail($detailRequest);


      return redirect()->back()->with('success', 'sukses menambahkan item');
    } catch (Throwable $error) {

      AppLog::execption($error);

      return redirect()->back()->with('error', $error->getMessage());
    }
  }

  public function updateQuantity(Request $request, $orderId)
  {
    try {
      $detailRequest = new AddOrderDetailRequest();
      $detailRequest->orderId = $orderId;
      $detailRequest->itemId = $request->post('item_id');
      $detailRequest->variantItemId = $request->post('variant_id');
      $detailRequest->quantity = (int) $request->post('quantity');
      $detailRequest->priceAtSale = (int) $request->post('price_at_sale');

      $this->orderService->updateQuantity($detailRequest);

      return redirect()->back()->with('success', 'sukses menambahkan stock');
    } catch (Throwable $error) {
      AppLog::execption($error);
      return redirect()->back()->with('error', $error->getMessage());
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
        'orderItem.item:id,name,part_number',
        'orderItem.variant:id,name,sku,price',
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
    } catch (Throwable $error) {

      AppLog::execption($error);
      return redirect()->back()->with('error', 'an internal server error');
    }
  }

  public function holdOrder(Request $request, string $orderId)
  {
    try {
      $discount = $request->post('discount', 0);
      $this->orderService->holdOrder($orderId, $discount);
      return redirect()->back()->with('success', 'order berhasil dihold');
    } catch (Throwable $error) {
      AppLog::execption($error);
      return redirect()->back()->with('error', 'an internal server error');
    }
  }

  public function deleteOrderItem(Request $request, string $orderId, $variantId)
  {
    try {
      $this->orderService->deleteOrderDetail($orderId, $variantId);
      return redirect()->back()->with('success', 'item berhasil dihapus');
    } catch (Throwable $error) {
      AppLog::execption($error);
      // dd($error->getMessage());
      return redirect()->back()->with('error', 'an internal server error');
    }
  }

  public function deleteAllOrderItem(Request $request, string $orderId)
  {
    try {
      $this->orderService->deleteAllOrderItems($orderId);
      return redirect()->back()->with('success', 'item berhasil dihapus');
    } catch (Throwable $error) {
      AppLog::execption($error);
      return redirect()->back()->with('error', 'an internal server error');
    }
  }
}
