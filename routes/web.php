<?php

use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Buyer\BuyerController;
// use App\Http\Controllers\Discount\DiscountController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Invetory\InventoryController;
use App\Http\Controllers\Item\ItemController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\SalesTransaction\SalesTransactionController;
use App\Http\Controllers\Analytical\AnalyticalController;
use App\Http\Controllers\Qr\QrController;
use App\Http\Controllers\Receipt\ReceiptController;
use App\Http\Controllers\Tenant\TenantController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Variant\VariantController;
use App\Mail\Auth\VerifyEmailMail;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {

    // Log::channel('app')->info('Info min dari app log');

    // Log::channel('app')->info('Hello from custom app log!', ['foo' => 'bar']);

    \Log::channel('app')->info('Pesan dari channel app');



    return Inertia::render('welcome');
})->name('home');

Route::middleware('auth')->group(function () {

    Route::resource('tenant', TenantController::class)
        ->except(['show'])
        ->names([
            'index' => 'tenant.index',
            'create' => 'tenant.create',
            'store' => 'tenant.store',
            'edit' => 'tenant.edit',
            'update' => 'tenant.update',
            'destory' => 'tenant.destory'
        ])->middleware(['whoCanIn:super_admin']);

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('/category', CategoryController::class)
        ->except(['show'])
        ->names([
            'index' => 'category.index',
            'create' => 'category.create',
            'store' => 'category.store',
            'edit' => 'category.edit',
            'update' => 'category.update',
            'destroy' => 'category.destroy'
        ])->middleware(['whoCanIn:super_admin,admin,manager']);



    // Route::middleware(['whoCanIn:admin,manager,employee'])->group(function () {

    Route::get('/order', [OrderController::class, 'createOrder'])->name('order.post');
    Route::post('/order/{orderId}/detail', [OrderController::class, 'addOrderDetail'])->name('order.post.detail');
    Route::put('/order/{orderId}/detail/quantity', [OrderController::class, 'updateQuantity'])->name('order.put.detail.quantity');
    Route::get('/order/{orderId}', [OrderController::class, 'index'])->name('menu');
    Route::post('/order/process/{orderId}', [OrderController::class, 'processOrder'])->name('order.process');
    Route::delete('/order/{orderId}/variant/{variantId}', [OrderController::class, 'deleteOrderItem'])->name('order.detail.delete');
    Route::delete('/order/{orderId}/variant', [OrderController::class, 'deleteAllOrderItem'])->name('order.detail.clear');
    Route::put('/order/{orderId}/hold', [OrderController::class, 'holdOrder'])->name('order.hold');
    Route::get('/order-history', [OrderController::class, 'orderHistory'])->name('order.histories');

        // Route::get('/item', [ItemController::class, 'showItem'])->name('item.index');
        // Route::get('/item/add', [ItemController::class, 'addItem'])->name('item.add');
        // Route::post('/item', [ItemController::class, 'store'])->name('item.post');
        // Route::get('/item/{itemId}/update', [ItemController::class, 'updateItemPage'])->name('item.update.page');
        // Route::post('/item/{itemId}/update', [ItemController::class, 'putUpdateItem'])->name('item.update.put');
        // Route::delete('/item/{itemId}', [ItemController::class, 'deleteItem'])->name('item.delete');
        // Route::post('/item/{itemId}/variant', [VariantController::class, 'post'])->name('variant.post');
        // Route::delete('/item/{itemId}/variant/{variantId}', [VariantController::class, 'delete'])->name('variant.delete');
        // Route::get('/item/variant', [ItemController::class, 'findItem'])->prefix('api');


    Route::get('/analytics-report', [AnalyticalController::class, 'index'])->name('analytical.index');
    Route::get('/analytics-report/preview', [AnalyticalController::class, 'pdfPreview'])->name('analytical.preview');

    Route::get('/qr-code/{text}', [QrController::class, 'generate'])->name('QrCode.generate');

    Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');

    Route::post('/inventory/adjust', [InventoryController::class, 'adjustStock'])->name('inventory.adjust');

    Route::get('/inventory/preview', [InventoryController::class, 'showPdfPreview'])->name('inventory.print');

    Route::get('/receipt/{orderId}', [ReceiptController::class, 'downloadReceiptPdf'])->name('receipt.download');
    // });



    Route::get('/buyer', [BuyerController::class, 'findBuyerByPhone'])->name('buyer.find')->prefix('api');

    Route::get('/buyer/list', [BuyerController::class, 'index'])->name('buyer.index');

    Route::get('/buyer/{buyer}/edit', [BuyerController::class, 'edit'])->name('buyer.edit');

    Route::put('/buyer/{id}', [BuyerController::class, 'update'])->name('buyer.update');

    // Route::delete('/buyer/{id}', [BuyerController::class, 'destroy'])->name('buyer.destroy');

    Route::resource('/user', UserController::class)
        ->except(['show'])
        ->names([
            'index' => 'user.index',
            'create' => 'user.crate',
            'store' => 'user.store',
            'edit' => 'user.edit',
            'update' => 'user.update',
            'destroy' => 'user.destroy'
        ])->middleware('whoCanIn:super_admin,admin,manager');

    Route::put('/user/login/to/{userId}', [UserController::class, 'updateTenantForLogin'])->name('user.login.tenant')->middleware('whoCanIn:super_admin');
    Route::put('/user/tenant/logout', [UserController::class, 'logoutFromTenant'])->name('user.logout.tenant')->middleware('whoCanIn:super_admin');

    Route::get('/transaction', [SalesTransactionController::class, 'salesTransaction'])->name('transaction.index');
    Route::get('/receipt/download/{orderId}', [ReceiptController::class, 'downloadReceiptPdf'])->name('transaction.receipt.download');


    // Route::resource('/discount', DiscountController::class)
    //     ->except(['show'])
    //     ->names([
    //         'index' => 'discount.index',
    //         'create' => 'discount.create',
    //         'store' => 'discount.store',
    //         'edit' => 'discount.edit',
    //         'update' => 'discount.update',
    //         'destroy' => 'discount.destroy'
    //     ]);





    // Route::patch('/discount/{id}/active', [DiscountController::class, 'updateStatusActive'])->name('discount.update.active');

    // Route::get('/testmail', function () {

    //     $user = User::where('email', 'yukinosento02@gmail.com')->first();

    //     Mail::to($user->email)
    //         ->send(new VerifyEmailMail($user));
    // });


    // Route::fallback(function () {
    //     return Inertia::render('error/error-page', ['status' => 404]);
    // });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/item.php';
