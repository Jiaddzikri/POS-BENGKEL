import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Variant } from '@/types';
import { getRawNumber, numberFormat } from '@/utils/number-format';
import { usePage } from '@inertiajs/react';
import { MouseEvent } from 'react';

interface AddVariantProps {
  newVariant: Variant;
  purchasePrice?: number;
  setNewVariant: (prev: any) => any;
  setShowAddVariant: (prev: boolean) => void;
  handleAddVariant: (e: MouseEvent<HTMLButtonElement>) => void;
}

export default function AddVariant({ newVariant, purchasePrice = 0, setNewVariant, setShowAddVariant, handleAddVariant }: AddVariantProps) {
  const { errors } = usePage().props;

  const varPrice = Number(newVariant.price) || 0;
  const margin = varPrice > 0 ? (((varPrice - purchasePrice) / varPrice) * 100).toFixed(2) : '0.00';

  return (
    <div className="mb-6 rounded-lg p-4">
      <h3 className="mb-3 text-sm font-medium">Tambah Variant Baru</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <div>
          <Label className="mb-1 block text-xs">Name</Label>
          <Input
            type="text"
            placeholder="name"
            value={newVariant.name}
            onChange={(e) => setNewVariant((prev: Variant) => ({ ...prev, name: e.target.value }))}
            className="rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {errors.name && <div className="mt-1 text-sm text-red-500">{errors.name}</div>}
        </div>
        <div>
          <Label className="mb-1 block text-xs">Minimum Stock</Label>
          <Input
            type="text"
            placeholder="minimum stock"
            value={numberFormat(newVariant.minimum_stock)}
            onChange={(e) => setNewVariant((prev: Variant) => ({ ...prev, minimum_stock: parseInt(getRawNumber(e.target.value)) }))}
            className="rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {errors.minimum_stock && <div className="mt-1 text-sm text-red-500">{errors.minimum_stock}</div>}
        </div>
        <div>
          <Label className="mb-1 block text-xs">Stock</Label>
          <Input
            type="text"
            placeholder="Stock"
            inputMode="numeric"
            value={numberFormat(newVariant.stock)}
            onChange={(e) => setNewVariant((prev: Variant) => ({ ...prev, stock: parseInt(getRawNumber(e.target.value)) }))}
            className="rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {errors.stock && <div className="mt-1 text-sm text-red-500">{errors.stock}</div>}
        </div>
        <div>
          <Label className="mb-1 block text-xs">Harga Jual</Label>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Harga Jual"
            value={numberFormat(newVariant.price)}
            onChange={(e) => setNewVariant((prev: Variant) => ({ ...prev, price: parseInt(getRawNumber(e.target.value)) }))}
            className="rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {errors.price && <div className="mt-1 text-sm text-red-500">{errors.price}</div>}
          {varPrice > 0 && <p className={`mt-0.5 text-xs ${Number(margin) < 0 ? 'text-red-500' : 'text-green-600'}`}>Margin: {margin}%</p>}
        </div>
        <div>
          <Label className="mb-1 block text-xs">SKU</Label>
          <Input
            type="text"
            placeholder="SKU"
            value={newVariant.sku}
            onChange={(e) => setNewVariant((prev: Variant) => ({ ...prev, sku: e.target.value }))}
            className="rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {errors.sku && <div className="mt-1 text-sm text-red-500">{errors.sku}</div>}
        </div>
      </div>
      <div className="mt-3 flex items-center space-x-2">
        <button onClick={(e) => handleAddVariant(e)} className="rounded-md bg-indigo-600 px-3 py-2 text-sm hover:bg-indigo-700">
          Tambah
        </button>
        <button onClick={() => setShowAddVariant(false)} className="rounded-md border px-3 py-2 text-sm">
          Batal
        </button>
      </div>
    </div>
  );
}
