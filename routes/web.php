<?php

use App\Http\Controllers\Item\ItemController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/menu', function () {
        return Inertia::render('menu');
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/item', function () {
        return Inertia::render('item');
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/item/add', [ItemController::class,'addItem'])->name('item.add');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
