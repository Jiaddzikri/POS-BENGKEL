import { Category, FormData, Variant } from '@/types';
import { useState } from 'react';
import AddItemActionButton from '../../../components/add-item-action-button';
import AddItemImage from '../../../components/add-item-image';
import AddItemQuickStats from '../../../components/add-item-quick-stats';
import AddItemVariant from '../../../components/add-item-variant';
import AddItemBasicInformation from './add-item-basic-information';

interface AddItemFormProps {
  categories: Category[];
}

export default function AddItemForm({ categories }: AddItemFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category_id: '',
    description: '',
    price: 0,
    brand: '',
    variants: [],
    image: null,
  });

  console.log(formData);

  const [images, setImages] = useState<File[]>([]);
  const [showVariants, setShowVariants] = useState<boolean>(false);

  type FormDataKey = keyof FormData;
  type VariantKey = keyof Variant;

  // const removeVariant = (id: number): void => {
  //   setVariants((prev) => prev.filter((variant) => variant.id !== id));
  // };

  const handleInputChange = (field: FormDataKey, value: string | number | Variant | File | null) => {
    if (field === 'variants' && typeof value === 'object' && value !== null) {
      setFormData((prev) => ({
        ...prev,
        [field as FormDataKey]: [...prev[field], value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field as FormDataKey]: value,
      }));
    }
  };

  return (
    <div className="px-6 py-6">
      <div className="mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <AddItemBasicInformation formData={formData} categories={categories} handleInputChange={handleInputChange} />
            <AddItemVariant formData={formData} handleInputChange={handleInputChange} />
            <div className="space-y-6 lg:col-span-1">
              <AddItemImage handleInputChange={handleInputChange} formData={formData} images={images} />
              <AddItemQuickStats formData={formData} categories={categories} />
            </div>
          </div>
        </div>
        <AddItemActionButton />
      </div>
    </div>
  );
}
