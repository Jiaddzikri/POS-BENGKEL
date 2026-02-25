import { Link } from '@inertiajs/react';
import { Plus, Upload } from 'lucide-react';
import { useState } from 'react';
import ImportItemModal from './import-item-modal';

export default function ItemHeader() {
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className="px-6 py-2">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Item Management</h1>
          <p className="mt-1 text-sm">Manage your products and inventory</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setImportOpen(true)}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Excel
          </button>

          <Link href="/item/create">
            <button className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </button>
          </Link>
        </div>
      </div>

      <ImportItemModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
