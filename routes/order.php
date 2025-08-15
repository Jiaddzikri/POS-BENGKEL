<?php

use App\Http\Controllers\Order\OrderController;

Route::middleware('auth')->group(function () {
  Route::get('/order', [OrderController::class, 'createOrder'])->name('order.post');
  Route::post('/order/{orderId}/detail', [OrderController::class, 'addOrderDetail'])->name('order.post.detail');
  Route::put('/order/{orderId}/detail/quantity', [OrderController::class, 'updateQuantity'])->name('order.put.detail.quantity');
  Route::get('/order/{orderId}', [OrderController::class, 'index'])->name('menu');
  Route::post('/order/process/{orderId}', [OrderController::class, 'processOrder'])->name('order.process');
  Route::delete('/order/{orderId}/variant/{variantId}', [OrderController::class, 'deleteOrderItem'])->name('order.detail.delete');
  Route::delete('/order/{orderId}/variant', [OrderController::class, 'deleteAllOrderItem'])->name('order.detail.clear');
  Route::put('/order/{orderId}/hold', [OrderController::class, 'holdOrder'])->name('order.hold');
  Route::get('/order-history', [OrderController::class, 'orderHistory'])->name('order.histories');
});