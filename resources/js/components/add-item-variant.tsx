import { FormItem, Variant } from '@/types';
import { getRawNumber, numberFormat } from '@/utils/number-format';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';

type VariantKey = keyof Variant;

interface ValidationErrors {
  name?: string;
  sku?: string;
  price?: string;
  minimum_stock?: string;
  stock?: string;
}

interface AddItemVarianProps {
  formData: FormItem;
  setData: any;
}

const calcMargin = (price: number, purchase: number): string => {
  if (price <= 0) return '—';
  return (((price - purchase) / price) * 100).toFixed(1) + '%';
};

export default function AddItemVariant({ formData, setData }: AddItemVarianProps) {
  const [variantForm, setVariantForm] = useState<Variant>({
    name: '',
    sku: '',
    price: 0,
    minimum_stock: 0,
    stock: 0,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const purchase = Number(formData.purchase_price) || 0;

  const handleChange = (field: VariantKey, value: string | number) => {
    setVariantForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field as keyof ValidationErrors]: undefined }));
    }
  };

  const validate = (): ValidationErrors => {
    const e: ValidationErrors = {};
    const { name, sku, price, minimum_stock, stock } = variantForm;

    if (!name?.trim()) e.name = 'Nama varian wajib diisi';
    else if (name.length < 2) e.name = 'Minimal 2 karakter';
    else if (name.length > 100) e.name = 'Maksimal 100 karakter';

    if (!sku?.trim()) e.sku = 'SKU wajib diisi';
    else if (sku.length < 3) e.sku = 'SKU minimal 3 karakter';
    else if (sku.length > 50) e.sku = 'SKU maksimal 50 karakter';
    else if (!/^[A-Za-z0-9-_]+$/.test(sku)) e.sku = 'Hanya huruf, angka, - dan _';
    else if (formData.variants?.some((v: Variant) => v.sku.toLowerCase() === sku.toLowerCase())) e.sku = 'SKU sudah digunakan';

    if (Number(price) < 0) e.price = 'Harga tidak boleh negatif';
    if (Number(stock) < 0) e.stock = 'Stok tidak boleh negatif';
    if (Number(minimum_stock) < 0) e.minimum_stock = 'Stok minimum tidak boleh negatif';
    if (Number(minimum_stock) > Number(stock)) e.minimum_stock = 'Stok minimum tidak boleh melebihi stok';

    return e;
  };

  const addVariant = async () => {
    setIsSubmitting(true);
    try {
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.error('Perbaiki error sebelum menambah varian');
        return;
      }
      setData((prev: any) => ({
        ...prev,
        variants: [...prev.variants, { ...variantForm, name: variantForm.name.trim(), sku: variantForm.sku.trim().toUpperCase() }],
      }));
      toast.success('Varian berhasil ditambahkan');
      setVariantForm({ name: '', sku: '', price: 0, minimum_stock: 0, stock: 0 });
      setErrors({});
    } catch {
      toast.error('Gagal menambah varian. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeVariant = (idx: number) => {
    setData((prev: any) => ({ ...prev, variants: prev.variants.filter((_: any, i: number) => i !== idx) }));
    toast.success('Varian dihapus');
  };

  const inputCls = (field: keyof ValidationErrors) =>
    `w-full rounded-md border px-2 py-1.5 text-sm focus:outline-none focus:ring-1 ${errors[field] ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`;

  const liveMargin = Number(variantForm.price) > 0 ? calcMargin(Number(variantForm.price), purchase) : null;
  const liveMarginPositive = liveMargin !== null && !liveMargin.startsWith('-');

  return (
    <div className="rounded-lg border">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-medium">Product Variant</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">Tambah varian produk (ukuran, warna, dll.)</p>
      </div>

      <div className="p-6">
        {/* ── Input row ── */}
        <div className="mb-4 grid grid-cols-12 items-start gap-3">
          {/* Variant Name – 3 cols */}
          <div className="col-span-3">
            <label className="mb-1 block text-xs font-medium">
              Nama Varian <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={variantForm.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={inputCls('name')}
              placeholder="mis. 500ml"
              maxLength={100}
            />
            {errors.name && <p className="mt-0.5 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* SKU – 2 cols */}
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium">
              SKU <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={variantForm.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              className={`font-mono ${inputCls('sku')}`}
              placeholder="SKU-001"
              maxLength={50}
            />
            {errors.sku && <p className="mt-0.5 text-xs text-red-500">{errors.sku}</p>}
          </div>

          {/* Stock – 1.5 cols */}
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium">Stok</label>
            <Input
              type="text"
              inputMode="numeric"
              value={numberFormat(Number(variantForm.stock))}
              onChange={(e) => handleChange('stock', getRawNumber(e.target.value))}
              className={inputCls('stock')}
              placeholder="0"
            />
            {errors.stock && <p className="mt-0.5 text-xs text-red-500">{errors.stock}</p>}
          </div>

          {/* Min Stock – 1.5 cols */}
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium">Stok Min.</label>
            <Input
              type="text"
              inputMode="numeric"
              value={numberFormat(Number(variantForm.minimum_stock))}
              onChange={(e) => handleChange('minimum_stock', getRawNumber(e.target.value))}
              className={inputCls('minimum_stock')}
              placeholder="0"
            />
            {errors.minimum_stock && <p className="mt-0.5 text-xs text-red-500">{errors.minimum_stock}</p>}
          </div>

          {/* Price – 2 cols */}
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-medium">
              Harga Jual <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-2 -translate-y-1/2 text-xs text-muted-foreground">Rp</span>
              <Input
                type="text"
                inputMode="numeric"
                value={numberFormat(Number(variantForm.price))}
                onChange={(e) => handleChange('price', getRawNumber(e.target.value))}
                className={`${errors.price ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'} w-full rounded-md border py-1.5 pr-2 pl-7 text-sm focus:ring-1 focus:outline-none`}
                placeholder="0"
              />
            </div>
            {errors.price && <p className="mt-0.5 text-xs text-red-500">{errors.price}</p>}
            {liveMargin && (
              <p className={`mt-0.5 text-xs font-medium ${liveMarginPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                ▲ {liveMargin}
              </p>
            )}
          </div>

          {/* Add button – 1 col */}
          <div className="col-span-1 pt-5">
            <Button
              type="button"
              onClick={addVariant}
              disabled={isSubmitting}
              variant="outline"
              size="icon"
              className="h-8 w-8"
              title="Tambah varian"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── Variant table ── */}
        {formData.variants && formData.variants.length > 0 && (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-3 py-2.5 font-medium">Nama Varian</th>
                  <th className="px-3 py-2.5 font-medium">SKU</th>
                  <th className="px-3 py-2.5 text-right font-medium">Stok</th>
                  <th className="px-3 py-2.5 text-right font-medium">Stok Min.</th>
                  <th className="px-3 py-2.5 text-right font-medium">Harga Jual</th>
                  <th className="px-3 py-2.5 text-right font-medium">Margin</th>
                  <th className="w-10 px-3 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {formData.variants.map((v: Variant, idx: number) => {
                  const vPrice = Number(v.price) || 0;
                  const margin = calcMargin(vPrice, purchase);
                  const isPos = !margin.startsWith('-') && margin !== '—';
                  return (
                    <tr key={`${v.sku}-${idx}`} className="border-b last:border-0">
                      <td className="px-3 py-2.5 font-medium">{v.name}</td>
                      <td className="px-3 py-2.5 font-mono text-xs">{v.sku}</td>
                      <td className="px-3 py-2.5 text-right">{numberFormat(Number(v.stock))}</td>
                      <td className="px-3 py-2.5 text-right">{numberFormat(Number(v.minimum_stock))}</td>
                      <td className="px-3 py-2.5 text-right">Rp {numberFormat(vPrice)}</td>
                      <td
                        className={`px-3 py-2.5 text-right text-xs font-semibold ${isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}
                      >
                        {margin}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => removeVariant(idx)}
                          className="text-muted-foreground transition-colors hover:text-red-500"
                          title="Hapus varian"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {(!formData.variants || formData.variants.length === 0) && (
          <p className="py-4 text-center text-sm text-muted-foreground">Belum ada varian. Isi form di atas lalu klik +</p>
        )}
      </div>
    </div>
  );
}
