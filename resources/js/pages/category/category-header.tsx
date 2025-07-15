import { Link } from "@inertiajs/react";
import { Plus } from "lucide-react";


export default function CategoryHeader() {
  return (
    <div className="px-6 py-2">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Category Management</h1>
          <p className="mt-1 text-sm">Manage your category</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/category/
          create">
            <button className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}