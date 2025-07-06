import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category, Item } from '@/types';
import { getRawNumber, numberFormat } from '@/utils/number-format';

interface BasicInformationProps {
  data: Item;
  handleItemChange: (field: keyof Item, value: string | number | File) => void;
  categories: Category[];
  errors: Partial<Record<keyof Item, string>>;
}

export default function BasicInformation({ data, handleItemChange, categories, errors }: BasicInformationProps) {
  return (
    <div className="rounded-lg border">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-medium">Informasi Dasar</h2>
      </div>
      <div className="space-y-4 px-6 py-4">
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
        </div>
      </div>
    </div>
  );
}
