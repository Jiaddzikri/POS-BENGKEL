import { Category, FormItem } from '@/types';
import { getRawNumber, numberFormat } from '@/utils/number-format';
import { TrendingDown, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

type Errors = Partial<Record<keyof FormItem, string>>;

const UOM_OPTIONS = ['Pcs', 'Liter', 'Set', 'Box'] as const;

interface AddItemBasicInformationProps {
  formData: FormItem;
  categories: Category[];
  setData: any;
  errors: Errors;
}

export default function AddItemBasicInformation({ categories, setData, formData, errors }: AddItemBasicInformationProps) {
  const [compatibilityInput, setCompatibilityInput] = useState('');

  const err = (field: keyof Errors) => (errors[field] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500');

  const sellPrice = Number(formData.selling_price) || 0;
  const buyPrice = Number(formData.purchase_price) || 0;
  const profitMargin = sellPrice > 0 ? (((sellPrice - buyPrice) / sellPrice) * 100).toFixed(1) : null;
  const marginPositive = profitMargin !== null && Number(profitMargin) >= 0;

  const addCompatibility = () => {
    const trimmed = compatibilityInput.trim();
    if (!trimmed) return;
    const current: string[] = formData.compatibility || [];
    if (!current.includes(trimmed)) setData('compatibility', [...current, trimmed]);
    setCompatibilityInput('');
  };

  const removeCompatibility = (value: string) =>
    setData(
      'compatibility',
      (formData.compatibility || []).filter((c: string) => c !== value),
    );

  return (
    <div className="rounded-lg border">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">Detail utama produk</p>
      </div>

      <div className="space-y-5 p-6">
        {/* ── Row 1: Category + Brand ── */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.category_id} onValueChange={(v) => setData('category_id', v)}>
              <SelectTrigger className={`w-full ${err('category_id')}`}>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="no-category" disabled>
                    Tidak ada kategori
                  </SelectItem>
                ) : (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>}
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">Brand</Label>
            <Input
              type="text"
              value={formData.brand}
              onChange={(e) => setData('brand', e.target.value)}
              className={err('brand')}
              placeholder="Merek produk"
              maxLength={100}
            />
            {errors.brand && <p className="mt-1 text-xs text-red-500">{errors.brand}</p>}
          </div>
        </div>

        {/* ── Row 2: Item Name + Part Number ── */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">
              Item Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setData('name', e.target.value)}
              className={err('name')}
              placeholder="Nama item"
              maxLength={200}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">Part Number</Label>
            <Input
              type="text"
              value={formData.part_number || ''}
              onChange={(e) => setData('part_number', e.target.value)}
              className={`font-mono ${err('part_number')}`}
              placeholder="mis. 16100-KWN-901"
              maxLength={100}
            />
            {errors.part_number && <p className="mt-1 text-xs text-red-500">{errors.part_number}</p>}
          </div>
        </div>

        {/* ── Row 3: Unit + Storage Location ── */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">
              Unit <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.uom || 'Pcs'} onValueChange={(v) => setData('uom', v)}>
              <SelectTrigger className={`w-full ${err('uom')}`}>
                <SelectValue placeholder="Pilih satuan" />
              </SelectTrigger>
              <SelectContent>
                {UOM_OPTIONS.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.uom && <p className="mt-1 text-xs text-red-500">{errors.uom}</p>}
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">Storage Location</Label>
            <Input
              type="text"
              value={formData.rack_location || ''}
              onChange={(e) => setData('rack_location', e.target.value)}
              className={err('rack_location')}
              placeholder="mis. Rak A1-03"
              maxLength={100}
            />
            {errors.rack_location && <p className="mt-1 text-xs text-red-500">{errors.rack_location}</p>}
          </div>
        </div>

        {/* ── Motor Compatibility ── */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium">Motor Compatibility</Label>
          <p className="mb-2 text-xs text-muted-foreground">Tambah merk/tipe motor, tekan Enter atau klik +</p>
          <div className="flex gap-2">
            <Input
              type="text"
              value={compatibilityInput}
              onChange={(e) => setCompatibilityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCompatibility();
                }
              }}
              placeholder="mis. Honda Beat 2020"
              className="flex-1"
            />
            <button
              type="button"
              onClick={addCompatibility}
              className="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              +
            </button>
          </div>
          {(formData.compatibility || []).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(formData.compatibility as string[]).map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeCompatibility(tag)}
                    className="ml-0.5 rounded-full text-muted-foreground hover:text-foreground"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Pricing: Purchase + Selling (inline margin indicator) ── */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">
              Harga Beli <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
              <Input
                type="text"
                inputMode="numeric"
                value={numberFormat(formData.purchase_price)}
                onChange={(e) => setData('purchase_price', getRawNumber(e.target.value))}
                className={`${err('purchase_price')} pl-8`}
                placeholder="0"
              />
            </div>
            {errors.purchase_price && <p className="mt-1 text-xs text-red-500">{errors.purchase_price}</p>}
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">
              Harga Jual <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
              <Input
                type="text"
                inputMode="numeric"
                value={numberFormat(formData.selling_price)}
                onChange={(e) => setData('selling_price', getRawNumber(e.target.value))}
                className={`${err('selling_price')} pl-8`}
                placeholder="0"
              />
            </div>
            {errors.selling_price && <p className="mt-1 text-xs text-red-500">{errors.selling_price}</p>}
            {/* ── Margin indicator ── */}
            {profitMargin !== null && (
              <div
                className={`mt-1.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
                  marginPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                }`}
              >
                {marginPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                Margin {profitMargin}%
              </div>
            )}
          </div>
        </div>

        {/* ── Stock & SKU ── */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="mb-1.5 block text-sm font-medium">SKU</Label>
            <Input
              type="text"
              value={formData.sku || ''}
              onChange={(e) => setData('sku', e.target.value)}
              className={`font-mono ${err('sku')}`}
              placeholder="mis. SPK-001"
              maxLength={100}
            />
            {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku}</p>}
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">
              Stok Awal <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min={0}
              value={formData.stock ?? 0}
              onChange={(e) => setData('stock', parseInt(e.target.value, 10) || 0)}
              className={err('stock')}
              placeholder="0"
            />
            {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock}</p>}
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-medium">
              Minimum Stok <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min={0}
              value={formData.minimum_stock ?? 0}
              onChange={(e) => setData('minimum_stock', parseInt(e.target.value, 10) || 0)}
              className={err('minimum_stock')}
              placeholder="0"
            />
            {errors.minimum_stock && <p className="mt-1 text-xs text-red-500">{errors.minimum_stock}</p>}
          </div>
        </div>

        {/* ── Description ── */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium">
            Description
            <span className="ml-1 text-xs text-muted-foreground">({formData.description?.length || 0}/1000)</span>
          </Label>
          <textarea
            value={formData.description}
            onChange={(e) => setData('description', e.target.value)}
            rows={3}
            className={`${err('description')} w-full rounded-md border px-3 py-2 text-sm focus:outline-none`}
            placeholder="Deskripsi produk..."
            maxLength={1000}
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>
      </div>
    </div>
  );
}
