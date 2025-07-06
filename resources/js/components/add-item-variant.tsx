import { FormItem, Variant } from '@/types';
import { getRawNumber, numberFormat } from '@/utils/number-format';
import { Button, Input } from '@headlessui/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Label } from './ui/label';

type FormDataKey = keyof FormItem;
type VariantKey = keyof Variant;

interface ValidationErrors {
  id?: string;
  name?: string;
  sku?: string;
  additional_price?: string;
  minimum_stock?: string;
  stock?: string;
}

interface AddItemVarianProps {
  formData: FormItem;
  handleInputChange: (field: FormDataKey, value: string | number | Variant) => void;
}

export default function AddItemVariant({ formData, handleInputChange }: AddItemVarianProps) {
  const [variantForm, setVariantForm] = useState<Variant>({
    name: '',
    sku: '',
    additional_price: 0,
    minimum_stock: 0,
    stock: 0,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVariantInputChange = (field: VariantKey, value: string | number) => {
    setVariantForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateVariantForm = (): ValidationErrors => {
    const validationErrors: ValidationErrors = {};
    const { name, sku, additional_price, minimum_stock, stock } = variantForm;

    if (!name || name.trim() === '') {
      validationErrors.name = 'Variant name is required';
    } else if (name.length < 2) {
      validationErrors.name = 'Variant name must be at least 2 characters';
    } else if (name.length > 100) {
      validationErrors.name = 'Variant name must not exceed 100 characters';
    }

    if (!sku || sku.trim() === '') {
      validationErrors.sku = 'SKU is required';
    } else if (sku.length < 3) {
      validationErrors.sku = 'SKU must be at least 3 characters';
    } else if (sku.length > 50) {
      validationErrors.sku = 'SKU must not exceed 50 characters';
    } else if (!/^[A-Za-z0-9-_]+$/.test(sku)) {
      validationErrors.sku = 'SKU can only contain letters, numbers, hyphens, and underscores';
    }

    if (formData.variants && Array.isArray(formData.variants)) {
      const existingSKUs = formData.variants.map((variant: Variant) => variant.sku.toLowerCase());
      if (existingSKUs.includes(sku.toLowerCase())) {
        validationErrors.sku = 'SKU already exists. Please use a unique SKU';
      }
    }

    if (Number(additional_price) < 0) {
      validationErrors.additional_price = 'Additional price cannot be negative';
    } else if (Number(additional_price) > 999999999) {
      validationErrors.additional_price = 'Additional price is too large';
    }

    if (Number(stock) < 0) {
      validationErrors.stock = 'Stock cannot be negative';
    } else if (Number(stock) > 999999) {
      validationErrors.stock = 'Stock value is too large';
    }

    if (Number(minimum_stock) < 0) {
      validationErrors.minimum_stock = 'Minimum stock cannot be negative';
    } else if (Number(minimum_stock) > 999999) {
      validationErrors.minimum_stock = 'Minimum stock value is too large';
    }

    if (Number(minimum_stock) > Number(stock)) {
      validationErrors.minimum_stock = 'Minimum stock cannot be greater than current stock';
    }

    return validationErrors;
  };

  const addVariantValueHandler = async () => {
    setIsSubmitting(true);

    try {
      const validationErrors = validateVariantForm();

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.error('Please fix the validation errors before adding the variant');
        return;
      }
      const cleanVariant: Variant = {
        ...variantForm,
        name: variantForm.name.trim(),
        sku: variantForm.sku.trim().toUpperCase(),
      };

      handleInputChange('variants', cleanVariant);

      toast.success('Variant successfully added');

      setVariantForm({
        name: '',
        sku: '',
        additional_price: 0,
        minimum_stock: 0,
        stock: 0,
      });

      setErrors({});
    } catch (error) {
      toast.error('Failed to add variant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (field: keyof ValidationErrors) => {
    const baseClass = 'w-full rounded-md border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none';
    const errorClass = 'border-red-500 focus:ring-red-500';
    const normalClass = 'focus:ring-blue-500';

    return `${baseClass} ${errors[field] ? errorClass : normalClass}`;
  };

  const getPriceInputClassName = () => {
    const baseClass = 'w-full rounded-md border py-2 pr-3 pl-8 text-sm focus:border-transparent focus:ring-2 focus:outline-none';
    const errorClass = 'border-red-500 focus:ring-red-500';
    const normalClass = 'focus:ring-blue-500';

    return `${baseClass} ${errors.additional_price ? errorClass : normalClass}`;
  };

  return (
    <div className="rounded-lg border">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-medium">Product Variant</h3>
        <p className="mt-1 text-sm">Add Product Variant</p>
      </div>

      <div className="space-y-4 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label className="mb-2 block text-sm font-medium">
              Variant Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              value={variantForm.name}
              onChange={(e) => handleVariantInputChange('name', e.target.value)}
              className={getInputClassName('name')}
              placeholder="Enter variant name"
              maxLength={100}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium">
              Additional Price <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-sm">Rp</span>
              <Input
                type="text"
                inputMode="numeric"
                value={numberFormat(Number(variantForm.additional_price))}
                onChange={(e) => handleVariantInputChange('additional_price', getRawNumber(e.target.value))}
                className={getPriceInputClassName()}
                placeholder="0"
              />
            </div>
            {errors.additional_price && <p className="mt-1 text-sm text-red-500">{errors.additional_price}</p>}
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium">Stock</Label>
            <Input
              type="text"
              inputMode="numeric"
              value={numberFormat(Number(variantForm.stock))}
              onChange={(e) => handleVariantInputChange('stock', getRawNumber(e.target.value))}
              className={getInputClassName('stock')}
              placeholder="0"
            />
            {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium">Minimum Stock</Label>
            <Input
              type="text"
              inputMode="numeric"
              value={numberFormat(Number(variantForm.minimum_stock))}
              onChange={(e) => handleVariantInputChange('minimum_stock', getRawNumber(e.target.value))}
              className={getInputClassName('minimum_stock')}
              placeholder="0"
            />
            {errors.minimum_stock && <p className="mt-1 text-sm text-red-500">{errors.minimum_stock}</p>}
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium">
              SKU <span className="text-red-500">*</span>
            </Label>
            <div className="flex">
              <Input
                type="text"
                value={variantForm.sku}
                onChange={(e) => handleVariantInputChange('sku', e.target.value)}
                className={`flex-1 rounded-l-md border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none ${
                  errors.sku ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="Product SKU"
                maxLength={50}
              />
            </div>
            {errors.sku && <p className="mt-1 text-sm text-red-500">{errors.sku}</p>}
          </div>
        </div>

        <div>
          <Button
            type="button"
            onClick={addVariantValueHandler}
            disabled={isSubmitting}
            className={`flex items-center gap-1 rounded-md border px-6 py-2 text-sm font-medium transition-colors ${
              isSubmitting ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'hover:bg-gray-50 active:bg-gray-100'
            }`}
          >
            <Plus className="h-4 w-4" />
            {isSubmitting ? 'Adding...' : 'Add Variant'}
          </Button>
        </div>
      </div>
    </div>
  );
}
