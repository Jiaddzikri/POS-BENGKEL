import { Category, FormData } from '@/types';

interface AddItemQuickStatsProps {
  formData: FormData;
  categories: Category[];
}
export default function AddItemQuickStats({ formData, categories }: AddItemQuickStatsProps) {
  return (
    <div className="rounded-lg border">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-medium">Quick Overview</h3>
      </div>

      <div className="space-y-4 p-6">
        {/* <div className="flex items-center justify-between text-sm">
          <span className="">Selling Price</span>
          <span className="font-medium">{formData.price ? `Rp ${parseInt(formData.price).toLocaleString('id-ID')}` : '-'}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="">Cost Price</span>
          <span className="font-medium">{formData.cost ? `Rp ${parseInt(formData.cost).toLocaleString('id-ID')}` : '-'}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="">Initial Stock</span>
          <span className="font-medium">
            {formData.stock || '0'} {formData.unit}
          </span>
        </div> */}
        <div className="flex items-center justify-between text-sm">
          <span className="">Category</span>
          <span className="font-medium">{formData.category_id ? categories.find((cat) => cat.id === formData.category_id)?.name : '-'}</span>
        </div>
      </div>
    </div>
  );
}
