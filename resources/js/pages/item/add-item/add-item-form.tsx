import { Category, FormItem, Variant } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';
import AddItemActionButton from '../../../components/add-item-action-button';
import AddItemImage from '../../../components/add-item-image';
import AddItemQuickStats from '../../../components/add-item-quick-stats';
import AddItemVariant from '../../../components/add-item-variant';
import AddItemBasicInformation from './add-item-basic-information';

type FormItemKey = keyof FormItem;

interface AddItemFormProps {
  categories: Category[];
  item?: FormItem;
}

export default function AddItemForm({ categories, item }: AddItemFormProps) {

  const { data, setData, post, reset, processing, errors } = useForm<FormItem>({
    name: item?.name || '',
    category_id: item?.category_id || '',
    description: item?.description || '',
    purchase_price: item?.purchase_price || 0,
    selling_price: item?.selling_price || 0,
    brand: item?.brand || '',
    variants: item?.variants || [],
    image: item?.image || null,
  });

  const handleInputChange = (field: FormItemKey, value: string | number | Variant | File | null) => {
    if (field === 'variants' && typeof value === 'object' && value !== null) {
      setData((prev) => ({
        ...prev,
        [field as FormItemKey]: [...prev[field], value],
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [field as FormItemKey]: value,
      }));
    }
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('item.post'), {
      onSuccess: () => {
        toast.success('Product Succesfully Added');
        reset('name', 'category_id', 'description', 'purchase_price', 'selling_price', 'brand', 'variants', 'image');
      },
      onError: () => {
        console.log(errors);
      },
    });
  };
  return (
    <div className="px-6 py-6">
      <div className="mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <AddItemBasicInformation errors={errors} formData={data} categories={categories} handleInputChange={handleInputChange} />
              <AddItemVariant formData={data} handleInputChange={handleInputChange} />
              <div className="space-y-6 lg:col-span-1">
                <AddItemImage handleInputChange={handleInputChange} />
                <AddItemQuickStats formData={data} categories={categories} />
              </div>
            </div>
          </div>
          <AddItemActionButton />
        </form>
      </div>
    </div>
  );
}
