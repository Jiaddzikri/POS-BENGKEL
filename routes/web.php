<?php

use App\Http\Controllers\Item\ItemController;
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

    // Menu
    Route::get('/menu', function () {
        return Inertia::render('menu');
    })->name('menu');

    Route::get('/item', [ItemController::class, 'showItem'])->name('item.index');

    Route::get('/item/add', [ItemController::class, 'addItem'])->name('item.add');
    Route::post('/item', [ItemController::class, 'postItem'])->name('item.post');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';