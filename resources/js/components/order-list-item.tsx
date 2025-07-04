import { ItemList } from '@/types';
import { PackageX } from 'lucide-react';

interface CashierListItemProps {
  items: ItemList[];
  addToCart: (item: ItemList) => void;
}

export default function CashierListItem({ items, addToCart }: CashierListItemProps) {
  const storagePath = import.meta.env.VITE_STORAGE_URL;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item: ItemList, index: number) => {
        const isOutOfStock = item.stock === 0;
        return (
          <button
            key={index}
            disabled={isOutOfStock}
            onClick={() => addToCart(item)}
            className={`relative rounded-lg border p-4 text-left transition-all duration-200 ${
              isOutOfStock ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-75' : 'hover:shadow-md active:scale-95'
            }`}
            type="button"
          >
            {isOutOfStock && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-gray-500/75">
                <div className="text-center text-white">
                  <PackageX className="mx-auto mb-2 h-8 w-8" />
                  <p className="text-sm font-semibold">STOK HABIS</p>
                </div>
              </div>
            )}
            <img src={`${storagePath}/${item.image_path}`} alt={item.variant_name} className="mb-3 h-32 w-full rounded-lg object-cover" />
            <h3 className="mb-1 line-clamp-2 font-medium">
              {item.variant_name} {item.sku}
            </h3>
            <p className="mb-1 text-lg font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
            <p className="text-xs text-gray-500">Stok: {item.stock}</p>
          </button>
        );
      })}
    </div>
  );
}
