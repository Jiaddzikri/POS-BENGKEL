<?php

use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Buyer\BuyerController;
use App\Http\Controllers\Item\ItemController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\SalesTransaction\SalesTransactionController;
use App\Http\Controllers\Tenant\TenantController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Variant\VariantController;
use App\Mail\HelloMail;
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


    Route::resource('/category', CategoryController::class)
        ->except(['show'])
        ->names([
            'index' => 'category.index',
            'create' => 'category.create',
            'store' => 'category.store',
            'edit' => 'category.edit',
            'update' => 'category.update',
            'destroy' => 'category.destroy'
        ]);
    Route::get('/buyer', [BuyerController::class, 'findBuyerByPhone'])->name('buyer.find')->prefix('api');

    Route::resource('/user', UserController::class)
        ->except(['show'])
        ->names([
            'index' => 'user.index',
            'create' => 'user.crate',
            'store' => 'user.store',
            'edit' => 'user.edit',
            'update' => 'user.update',
            'destroy' => 'user.destroy'
        ]);

    Route::get('/transaction', [SalesTransactionController::class, 'salesTransaction'])->name('transaction.index');

    Route::get('/testmail', function () {
        Mail::to('muhamadilhan02404@gmail.com')
        ->send(new HelloMail());
    });

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
