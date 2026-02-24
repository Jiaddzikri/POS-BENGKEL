import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category, Item } from '@/types';
import { getRawNumber, numberFormat } from '@/utils/number-format';
import { X } from 'lucide-react';
import { useState } from 'react';

const UOM_OPTIONS = ['Pcs', 'Liter', 'Set', 'Box'] as const;

interface BasicInformationProps {
  data: Item;
  handleItemChange: (field: keyof Item, value: string | number | File | string[]) => void;
  categories: Category[];
  errors: Partial<Record<keyof Item, string>>;
}

export default function BasicInformation({ data, handleItemChange, categories, errors }: BasicInformationProps) {
  const [compatibilityInput, setCompatibilityInput] = useState('');

  const profitMargin = data.selling_price > 0 ? (((data.selling_price - data.purchase_price) / data.selling_price) * 100).toFixed(2) : '0.00';

  const addCompatibility = () => {
    const trimmed = compatibilityInput.trim();
    if (!trimmed) return;
    const current: string[] = data.compatibility || [];
    if (!current.includes(trimmed)) {
      handleItemChange('compatibility', [...current, trimmed]);
    }
    setCompatibilityInput('');
  };

  const removeCompatibility = (value: string) => {
    handleItemChange(
      'compatibility',
      (data.compatibility || []).filter((c: string) => c !== value),
    );
  };

  return (
    <div className="rounded-lg border">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-medium">Informasi Dasar</h2>
      </div>
      <div className="space-y-4 px-6 py-4">
        {/* Nama Item */}
        <div>
          <label className="mb-1 block text-sm font-medium">Nama Item</label>
          <Input
            type="text"
            value={data.item_name}
            onChange={(e) => handleItemChange('item_name', e.target.value)}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none ${errors.item_name ? 'border-red-500 focus:border-red-500' : ''}`}
          />
          {errors.item_name && <p className="mt-1 text-sm text-red-600">{errors.item_name}</p>}
        </div>

        {/* Deskripsi */}
        <div>
          <label className="mb-1 block text-sm font-medium">Deskripsi</label>
          <textarea
            value={data.description}
            onChange={(e) => handleItemChange('description', e.target.value)}
            rows={3}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none ${errors.description ? 'border-red-500 focus:border-red-500' : ''}`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Kategori + Brand */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Kategori</label>
            <Select value={data.category_id} onValueChange={(value) => handleItemChange('category_id', value)}>
              <SelectTrigger id="category-select" className={`w-full ${errors.category_id ? 'border-red-500 focus:border-red-500' : ''}`}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="" disabled>
                    No categories available
                  </SelectItem>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Brand</label>
            <Input
              type="text"
              value={data.brand}
              onChange={(e) => handleItemChange('brand', e.target.value)}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none ${errors.brand ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
          </div>
        </div>

        {/* Part Number */}
        <div>
          <label className="mb-1 block text-sm font-medium">Part Number</label>
          <Input
            type="text"
            value={data.part_number || ''}
            onChange={(e) => handleItemChange('part_number', e.target.value)}
            placeholder="e.g. 16100-KWN-901"
            maxLength={100}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none ${errors.part_number ? 'border-red-500 focus:border-red-500' : ''}`}
          />
          {errors.part_number && <p className="mt-1 text-sm text-red-600">{errors.part_number}</p>}
        </div>

        {/* UOM + Rack Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Unit of Measurement</label>
            <Select value={data.uom || 'Pcs'} onValueChange={(value) => handleItemChange('uom', value)}>
              <SelectTrigger className={`w-full ${errors.uom ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="UOM" />
              </SelectTrigger>
              <SelectContent>
                {UOM_OPTIONS.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.uom && <p className="mt-1 text-sm text-red-600">{errors.uom}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Rack Location</label>
            <Input
              type="text"
              value={data.rack_location || ''}
              onChange={(e) => handleItemChange('rack_location', e.target.value)}
              placeholder="e.g. A1-03"
              maxLength={100}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none ${errors.rack_location ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {errors.rack_location && <p className="mt-1 text-sm text-red-600">{errors.rack_location}</p>}
          </div>
        </div>

        {/* Compatibility */}
        <div>
          <label className="mb-1 block text-sm font-medium">Compatibility (Merk / Tipe Motor)</label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={compatibilityInput}
              onChange={(e) => setCompatibilityInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompatibility())}
              placeholder="e.g. Honda Beat 2020"
              className="flex-1"
            />
            <button type="button" onClick={addCompatibility} className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50">
              Tambah
            </button>
          </div>
          {(data.compatibility || []).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {(data.compatibility as string[]).map((item) => (
                <span key={item} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {item}
                  <button type="button" onClick={() => removeCompatibility(item)} className="hover:text-blue-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Harga Beli */}
        <div>
          <label className="mb-1 block text-sm font-medium">Harga Beli</label>
          <div className="relative">
            <span className="absolute top-1.5 left-3">Rp</span>
            <Input
              type="text"
              value={numberFormat(data.purchase_price)}
              onChange={(e) => handleItemChange('purchase_price', parseInt(getRawNumber(e.target.value)))}
              className={`w-full rounded-md border py-3 pr-3 pl-10 focus:outline-none ${
                errors.purchase_price ? 'border-red-500 focus:border-red-500' : ''
              }`}
            />
          </div>
          {errors.purchase_price && <p className="mt-1 text-sm text-red-600">{errors.purchase_price}</p>}
        </div>

        {/* Harga Jual */}
        <div>
          <label className="mb-1 block text-sm font-medium">Harga Jual</label>
          <div className="relative">
            <span className="absolute top-1.5 left-3">Rp</span>
            <Input
              type="text"
              value={numberFormat(data.selling_price)}
              onChange={(e) => handleItemChange('selling_price', parseInt(getRawNumber(e.target.value)))}
              className={`w-full rounded-md border py-3 pr-3 pl-10 focus:outline-none ${
                errors.selling_price ? 'border-red-500 focus:border-red-500' : ''
              }`}
            />
          </div>
          {errors.selling_price && <p className="mt-1 text-sm text-red-600">{errors.selling_price}</p>}
          {data.selling_price > 0 && (
            <p className={`mt-1 text-xs ${Number(profitMargin) < 0 ? 'text-red-500' : 'text-green-600'}`}>Profit Margin: {profitMargin}%</p>
          )}
        </div>

        {/* SKU / Stock / Min Stock */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">SKU</label>
            <Input
              type="text"
              value={data.sku || ''}
              onChange={(e) => handleItemChange('sku', e.target.value)}
              placeholder="mis. SPK-001"
              maxLength={100}
              className={`w-full rounded-md border px-3 py-2 font-mono focus:outline-none ${errors.sku ? 'border-red-500' : ''}`}
            />
            {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Stok</label>
            <Input
              type="number"
              min={0}
              value={data.stock ?? 0}
              onChange={(e) => handleItemChange('stock', parseInt(e.target.value, 10) || 0)}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none ${errors.stock ? 'border-red-500' : ''}`}
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Minimum Stok</label>
            <Input
              type="number"
              min={0}
              value={data.minimum_stock ?? 0}
              onChange={(e) => handleItemChange('minimum_stock', parseInt(e.target.value, 10) || 0)}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none ${errors.minimum_stock ? 'border-red-500' : ''}`}
            />
            {errors.minimum_stock && <p className="mt-1 text-sm text-red-600">{errors.minimum_stock}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
