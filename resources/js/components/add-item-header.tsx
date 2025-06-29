import { Eye, Save } from 'lucide-react';

export default function AddItemHeader() {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-semibold">Add New Item</h1>
            <p className="mt-1 text-sm">Create a new product for your inventory</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </button>
          <button className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" />
            Save Item
          </button>
        </div>
      </div>
    </div>
  );
}
