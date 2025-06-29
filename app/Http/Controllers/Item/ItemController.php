<?php

namespace App\Http\Controllers\Item;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
 
    public function addItem(Request $request)
    {
        $tenantId = $request->user()->tenant_id;

        $categories = Category::query()->when($tenantId, function ($query, $tenant) {
            $query->where('tenant_id', $tenant);
        })->get();

        return Inertia::render('item/add-item', [
            "categories" => $categories

        ]);
    }
}