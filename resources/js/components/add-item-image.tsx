import { FormItem, Variant } from '@/types';
import { ImageIcon } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';

type FormItemKey = keyof FormItem;

interface AddItemImageProps {
  handleInputChange: (field: FormItemKey, value: number | string | Variant | File | null) => void;
}

export default function AddItemImage({ handleInputChange }: AddItemImageProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      handleInputChange('image', file);
    } else {
      handleInputChange('image', null);
    }
  };
  return (
    <div className="rounded-lg border">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-medium">Product Images</h3>
        <p className="mt-1 text-sm">Upload product photos</p>
      </div>

      <div className="w-full p-6">
        <Label
          htmlFor="item-image"
          className="flex flex-col rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:border-gray-400"
        >
          <Input onChange={(e) => handleImageChange(e)} id="item-image" type="file" className="hidden" />
          <ImageIcon className="mx-auto mb-4 h-12 w-12" />
          <div className="mb-2 text-sm">
            <span className="cursor-pointer font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
          </div>
          <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
        </Label>

        {/* {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image.webkitRelativePath} alt={`Product ${index + 1}`} className="h-20 w-full rounded-lg object-cover" />
                <button className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs hover:bg-red-600">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
}
