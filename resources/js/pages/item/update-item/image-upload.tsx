import { Button } from '@/components/ui/button';
import { Item } from '@/types';
import { ImageIcon, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImageUploadProps {
  existingImage?: string | null;
  handleItemChange: (field: keyof Item, value: string | number | File) => void;
  errors: Partial<Record<keyof Item, string>>;
}

export default function ImageUpload({ handleItemChange, existingImage = null, errors }: ImageUploadProps) {
  const existingImagePath = import.meta.env.VITE_STORAGE_URL + '/' + existingImage;

  const [currentImage, setCurrentImage] = useState(existingImagePath);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setCurrentImage(existingImagePath);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    const file = files && files.length > 0 ? files[0] : null;
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCurrentImage(previewUrl);
      handleItemChange('new_image', file);
    } else {
      setCurrentImage(existingImagePath);
    }
  };
  const imageError = errors.new_image || errors.image;
  const hasImageError = !!imageError;

  return (
    <div className="rounded-lg border">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-medium">Preview Gambar</h2>
      </div>
      <div className="space-y-3 px-6 py-4">
        {currentImage ? (
          <div className="group relative">
            <img src={`${currentImage}`} alt="" className={`h-64 w-full rounded-lg border shadow-sm ${hasImageError ? 'border-red-500' : ''}`} />
            <div className="bg-opacity-0 group-hover:bg-opacity-40 absolute inset-0 flex items-center justify-center rounded-lg transition-all duration-200">
              <div className="flex space-x-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Button onClick={handleClick} className="rounded-full p-3 shadow-lg transition-colors" title="Ganti gambar">
                  <Upload className="h-5 w-5" />
                </Button>
                <Button onClick={handleRemoveImage} className="rounded-full p-3 shadow-lg transition-colors" title="Hapus gambar">
                  <X className="h-5 w-5 text-red-600" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className={`flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200 ${
              hasImageError ? 'border-red-500 bg-red-50 hover:border-red-600' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <ImageIcon className={`mb-4 h-16 w-16 ${hasImageError ? 'text-red-500' : 'text-gray-400'}`} />
            <p className={`mb-2 text-lg font-medium ${hasImageError ? 'text-red-700' : 'text-gray-700'}`}>Pilih gambar</p>
            <p className={`mb-4 text-sm ${hasImageError ? 'text-red-600' : 'text-gray-500'}`}>PNG, JPG, JPEG, WebP hingga 5MB</p>
            <div
              className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
                hasImageError ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Pilih File
            </div>
          </div>
        )}
        {imageError && (
          <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">{imageError}</p>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/png,image/jpg,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />
      </div>
    </div>
  );
}
