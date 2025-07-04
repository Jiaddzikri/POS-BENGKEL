<?php

use App\Http\Controllers\Item\ItemController;
use App\Http\Controllers\Order\OrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware('auth')->group(function () {
    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/order', [OrderController::class, 'createOrder'])->name('order.post');
    Route::get('/order/{orderId}', [OrderController::class, 'index'])->name('menu');
    Route::post('/order/process/{orderId}', [OrderController::class, 'processOrder'])->name('order.process');

    Route::get('/item', [ItemController::class, 'showItem'])->name('item.index');

    Route::get('/item/add', [ItemController::class, 'addItem'])->name('item.add');
    Route::post('/item', [ItemController::class, 'postItem'])->name('item.post');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';