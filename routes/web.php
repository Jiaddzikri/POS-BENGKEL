<?php

use App\Http\Controllers\Buyer\BuyerController;
use App\Http\Controllers\Item\ItemController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\Tenant\TenantController;
use App\Http\Controllers\Variant\VariantController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
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
        ]);

    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/order', [OrderController::class, 'createOrder'])->name('order.post');
    Route::get('/order/{orderId}', [OrderController::class, 'index'])->name('menu');
    Route::post('/order/process/{orderId}', [OrderController::class, 'processOrder'])->name('order.process');

    Route::get('/item', [ItemController::class, 'showItem'])->name('item.index');

    Route::get('/item/add', [ItemController::class, 'addItem'])->name('item.add');
    Route::post('/item', [ItemController::class, 'postItem'])->name('item.post');
    Route::get('/item/{itemId}/update', [ItemController::class, 'updateItemPage'])->name('item.update.page');
    Route::post('/item/{itemId}/update', [ItemController::class, 'putUpdateItem'])->name('item.update.put');

    Route::post('/item/{itemId}/variant', [VariantController::class, 'post'])->name('variant.post');
    Route::delete('/item/{itemId}/variant/{variantId}', [VariantController::class, 'delete'])->name('variant.delete');

    Route::get('/buyer', [BuyerController::class, 'findBuyerByPhone'])->name('buyer.find')->prefix('api');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
