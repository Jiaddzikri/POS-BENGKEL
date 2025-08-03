import { ItemList } from '@/types';
import { PackageX } from 'lucide-react';

interface CashierListItemProps {
  items: ItemList[];
  handleAddItem: (item: ItemList) => void;
}

export default function CashierListItem({ items, handleAddItem }: CashierListItemProps) {
  const storagePath = import.meta.env.VITE_STORAGE_URL;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item: ItemList, index: number) => {
        const isOutOfStock = item.stock === 0;
        return (
          <button
            key={index}
            disabled={isOutOfStock}
            onClick={() => handleAddItem(item)}
            className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
              isOutOfStock
                ? 'cursor-not-allowed border-gray-200 bg-indigo-600'
                : 'bg-indigo-600 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg active:scale-98'
            }`}
            type="button"
          >
            {isOutOfStock && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90">
                <div className="text-center">
                  <PackageX className="mx-auto mb-2 h-6 w-6 text-gray-400" />
                  <p className="text-xs font-semibold tracking-wide text-gray-400">STOK HABIS</p>
                </div>
              </div>
            )}

            <div className="p-5">
              <div className="mb-3 flex flex-col justify-start gap-3">
                <div className="flex-1">
                  <h3 className="line-clamp-2 text-sm leading-tight font-semibold text-white">{item.variant_name}</h3>
                </div>
                <span className="ml-2 flex-shrink-0 rounded-full bg-white px-2 py-1 text-[.7rem] font-medium text-gray-500">{item.sku}</span>
              </div>

              <div className="mb-3">
                <p className="text-xl font-bold text-white">Rp {item.price.toLocaleString('id-ID')}</p>
              </div>

              {/* Stock info */}
              <div className="flex items-center justify-between">
                <div
                  className={`relative flex gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                    item.stock > 10 ? 'bg-green-100 text-green-700' : item.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  <div
                    className={`absolute top-0 left-0 h-full w-full rounded-full opacity-30 ${item.stock > 10 ? 'bg-green-500' : item.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  />
                  Stok: {item.stock}
                </div>

                {!isOutOfStock && (
                  <div className="flex items-center gap-1 text-xs font-medium text-white">
                    <span>Tambah</span>
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Hover effect accent */}
            {!isOutOfStock && (
              <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transform bg-gradient-to-r from-blue-500 to-purple-600 transition-transform duration-300 group-hover:scale-x-100" />
            )}
          </button>
        );
      })}
    </div>
  );
}
