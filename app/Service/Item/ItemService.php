<?php

namespace App\Service\Item;

use App\Models\Item;
use App\Models\VariantItem;
use App\Request\PostItemAttributeRequest;
use App\Request\UpdateItemRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ItemService
{
    /**
     * Handle create item. 
     * NOTE: Controller harus memastikan request->tenant_id valid 
     * (ambil dari Auth user jika Tenant, ambil dari Input jika Super Admin).
     */
    public function store(PostItemAttributeRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $createdItem = Item::create([
                "tenant_id" => $request->tenant_id,
                "name" => $request->name,
                "category_id" => $request->category_id,
                "brand" => $request->brand,
                "purchase_price" => $request->purchase_price,
                "selling_price" => $request->selling_price,
                "description" => $request->desciption,
            ]);

            foreach ($request->variants as $variant) {
                VariantItem::create([
                    "item_id" => $createdItem->id,
                    "name" => $variant->name,
                    "additional_price" => $variant->additional_price,
                    "stock" => $variant->stock,
                    "minimum_stock" => $variant->minimum_stock,
                    "sku" => $variant->sku
                ]);
            }

            return $createdItem->load('variants');
        });
    }

    public function update(UpdateItemRequest $request, string $itemId)
    {
        return DB::transaction(function () use ($request, $itemId) {
            $item = Item::findOrFail($itemId);
            
            // Logic Image
            $path = $item->image_path;

                $path = $request->new_image->store('uploads', 'public');
                if ($item->image_path) {
                    Storage::disk('public')->delete($item->image_path);
                }
       

            $item->update([
                "tenant_id" => $request->tenant_id,
                "name" => $request->name,
                "category_id" => $request->category_id,
                "brand" => $request->brand,
                "purchase_price" => $request->purchase_price,
                "selling_price" => $request->selling_price,
                "description" => $request->description,
                "image_path" => $path,
                "status" => $request->status,
            ]);

            // Cek if variants exist & is array to prevent error
            if (!empty($request->variants) && is_array($request->variants)) {
                foreach ($request->variants as $variant) {
                    // Pastikan update variant milik item ini (security check)
                    VariantItem::where("id", $variant->id)
                        ->where('item_id', $item->id) 
                        ->update([
                            "name" => $variant->name,
                            "additional_price" => $variant->additional_price,
                            "stock" => $variant->stock,
                            "minimum_stock" => $variant->minimum_stock,
                            "sku" => $variant->sku
                        ]);
                }
            }
            return $item->load('variants');
        });
    }

    // --- READ METHODS (Support Nullable Tenant ID) ---

    public function getOutOfStockCount(?string $tenantId)
    {
        return $this->baseOutOfStockStory($tenantId)->count();
    }

    public function getLowStockItem(?string $tenantId)
    {
        return $this->baseLowStockQuery($tenantId)->get();
    }

    public function getLowStockCount(?string $tenantId)
    {
        return $this->baseLowStockQuery($tenantId)->count();
    }

    public function getActiveItemCount(?string $tenantId)
    {
        return $this->baseItemQuery($tenantId, [])
            ->where('items.status', 'active')
            ->count('items.id');
    }

    public function getItemCount(?string $tenantId)
    {
        return $this->baseItemQuery($tenantId, [])
            ->count('items.id');
    }

    public function getPaginatedVariants(?string $tenantId, array $filters = [])
    {
        $query = $this->baseVariantQuery($tenantId, $filters);
        $variants = $query->paginate(10)->withQueryString();
        $variants->load(['item.category']);

        return $variants;
    }

    public function getPaginatedItems(?string $tenantId, array $filters = [])
    {
        $query = $this->baseItemQuery($tenantId, $filters);
        return $query->paginate(10)->withQueryString();
    }

    // --- BASE QUERIES (The Core Fixes) ---

    private function baseLowStockQuery(?string $tenantId = null)
    {
        return VariantItem::whereHas('item', function ($q) use ($tenantId) {
            $q->when($tenantId, fn($sub) => $sub->where('tenant_id', $tenantId));
            $q->where('is_deleted', false);
        })
        ->whereColumn('stock', '<=', 'minimum_stock')
        ->where('is_deleted', false);
    }

    private function baseOutOfStockStory(?string $tenantId)
    {
        return VariantItem::whereHas('item', function ($q) use ($tenantId) {
            $q->when($tenantId, fn($sub) => $sub->where('tenant_id', $tenantId));
            $q->where('is_deleted', false);
        })
        ->where('stock', '=', 0)
        ->where('is_deleted', false);
    }

    private function baseItemQuery(?string $tenantId, array $filters = [])
    {
        $query = Item::query()
            ->with([
                'category',
                'variants' => fn($q) => $q->where('is_deleted', false),
            ])
            ->leftJoin('categories', 'items.category_id', '=', 'categories.id')
            ->leftJoin('variant_items', 'items.id', '=', 'variant_items.item_id')
            ->select('items.*', 'categories.name as category_name')
            ->distinct()
            ->where('items.is_deleted', false)
            ->where('variant_items.is_deleted', false);

        // FIX: Hanya filter tenant_id jika tidak null
        $query->when($tenantId, function ($q) use ($tenantId) {
            $q->where('items.tenant_id', $tenantId);
        });

        $query->when($filters['search'] ?? null, function ($q, $search) {
            $searchTerm = '%' . $search . '%';
            $q->where(function ($subQuery) use ($searchTerm) {
                $subQuery->where('items.name', 'like', $searchTerm)
                    ->orWhere('variant_items.name', 'like', $searchTerm)
                    ->orWhere('variant_items.sku', 'like', $searchTerm)
                    ->orWhere('categories.name', 'like', $searchTerm);
            });
        });

        $query->when($filters['category'] ?? null, fn($q, $id) => $q->where('items.category_id', $id));

        $query->when($filters['minPrice'] ?? null, fn($q, $price) => 
            $q->whereRaw('items.selling_price + variant_items.additional_price >= ?', [$price])
        );

        $query->when($filters['maxPrice'] ?? null, fn($q, $price) => 
            $q->whereRaw('items.selling_price + variant_items.additional_price <= ?', [$price])
        );

        $query->when($filters['status'] ?? null, fn($q, $status) => $q->where('items.status', $status));

        $sortBy = $filters['sortBy'] ?? 'created_at';
        $sortOrder = $filters['sortOrder'] ?? 'desc';

        switch ($sortBy) {
            case 'name':
                $query->orderBy('items.name', $sortOrder);
                break;
            case 'price':
                $query->orderByRaw('items.selling_price + variant_items.additional_price ' . $sortOrder);
                break;
            case 'updated_at':
                $query->orderBy('items.updated_at', $sortOrder);
                break;
            default:
                $query->orderBy('items.created_at', $sortOrder);
        }

        return $query;
    }

    private function baseVariantQuery(?string $tenantId, array $filters = [])
    {
        $query = VariantItem::query()
            ->select([
                'variant_items.*',
                'items.name as item_name',
                'categories.name as category_name'
            ])
            ->join('items', 'variant_items.item_id', '=', 'items.id')
            ->leftJoin('categories', 'items.category_id', '=', 'categories.id')
            ->where('variant_items.is_deleted', false);

        // FIX: Hanya filter tenant_id jika tidak null
        $query->when($tenantId, function ($q) use ($tenantId) {
            $q->where('items.tenant_id', $tenantId);
        });

        if (isset($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('variant_items.sku', 'like', $searchTerm)
                    ->orWhere('variant_items.name', 'like', $searchTerm)
                    ->orWhere('items.name', 'like', $searchTerm)
                    ->orWhere('categories.name', 'like', $searchTerm);
            });
        }
        
        $query->when($filters['category'] ?? null, fn($q, $id) => $q->where('categories.id', $id));
        
        $query->when($filters['minPrice'] ?? null, fn($q, $price) => 
            $q->whereRaw('items.selling_price + variant_items.additional_price >= ?', [$price])
        );

        $query->when($filters['maxPrice'] ?? null, fn($q, $price) => 
            $q->whereRaw('items.selling_price + variant_items.additional_price <= ?', [$price])
        );

        if (isset($filters['stockCondition'])) {
            switch ($filters['stockCondition']) {
                case 'low':
                    $query->whereColumn('variant_items.stock', '<=', 'variant_items.minimum_stock');
                    break;
                case 'out_of_stock':
                    $query->where('variant_items.stock', '=', 0);
                    break;
                case 'in_stock':
                    $query->where('variant_items.stock', '>', 0);
                    break;
            }
        }

        $sortBy = $filters['sortBy'] ?? 'created_at';
        $sortOrder = $filters['sortOrder'] ?? 'desc';

        switch ($sortBy) {
            case 'name':
                $query->orderBy('variant_items.name', $sortOrder);
                break;
            case 'price':
                $query->orderByRaw('items.selling_price + variant_items.additional_price ' . $sortOrder);
                break;
            case 'updated_at':
                $query->orderBy('variant_items.updated_at', $sortOrder);
                break;
            default:
                $query->orderBy('variant_items.created_at', $sortOrder);
        }

        return $query;
    }
}