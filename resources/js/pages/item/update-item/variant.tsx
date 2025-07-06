import { Plus } from 'lucide-react';
import { Dispatch, ReactNode, SetStateAction } from 'react';

interface VariantProps {
  children: ReactNode;
  setShowAddVariant: Dispatch<SetStateAction<boolean>>;
}

export default function VariantContent({ children, setShowAddVariant }: VariantProps) {
  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-lg font-medium">Variant Item</h2>
        <button onClick={() => setShowAddVariant(true)} className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium">
          <Plus className="mr-1 h-4 w-4" />
          Tambah Variant
        </button>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}
