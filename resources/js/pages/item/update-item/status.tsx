import { Item } from '@/types';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';

interface StatusProps {
  data: Item;
  handleItemChange: (field: keyof Item, value: string | number) => void;
}

export default function Status({ data, handleItemChange }: StatusProps) {
  const [isActive, setIsActive] = useState(data.is_active);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const newStatus = !isActive;

    setIsActive(newStatus);
    handleItemChange('status', newStatus == false ? 'inactive' : 'active');
    setIsLoading(false);
  };
  return (
    <div className="rounded-lg border">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-medium">Status</h2>
      </div>
      <div className="px-6 py-4">
        <div className={`flex items-center space-x-3`}>
          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              } `}
            >
              {isActive ? (
                <>
                  <Eye className="mr-1 h-3 w-3" />
                  Aktif
                </>
              ) : (
                <>
                  <EyeOff className="mr-1 h-3 w-3" />
                  Tidak Aktif
                </>
              )}
            </span>
          </div>

          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`relative inline-flex items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
              isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-200 hover:bg-gray-300'
            } `}
            role="switch"
            aria-checked={isActive}
            aria-label={`Toggle product status ${isActive ? 'off' : 'on'}`}
          >
            <span
              className={`inline-block rounded-full bg-white shadow-lg ring-0 transition-all duration-200 ease-in-out ${isActive ? '' : 'translate-x-0'} ${isLoading ? 'opacity-50' : 'opacity-100'} `}
            >
              <span className="flex h-full w-full items-center justify-center">
                {isActive ? <Check className="h-8 w-8 text-green-600" /> : <X className="h-8 w-8 text-gray-400" />}
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
