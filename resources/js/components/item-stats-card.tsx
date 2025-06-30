import { ItemStats } from '@/types';
import { AlertTriangle, BarChart3, Package, Tag } from 'lucide-react';

interface ItemStatsProps {
  stats: ItemStats;
}
export default function ItemStatsCard({ stats }: ItemStatsProps) {
  return (
    <div className="px-6 py-2">
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Total Items</p>
              <p className="text-2xl font-semibold">{stats.total}</p>
            </div>
            <div className="rounded-lg bg-blue-100 p-2">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Active Items</p>
              <p className="text-2xl font-semibold">{stats.active_items}</p>
            </div>
            <div className="rounded-lg bg-green-100 p-2">
              <Tag className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Low Stock</p>
              <p className="text-2xl font-semibold text-orange-600">{stats.low_stock}</p>
            </div>
            <div className="rounded-lg bg-orange-100 p-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Categories</p>
              <p className="text-2xl font-semibold">{stats.categories}</p>
            </div>
            <div className="rounded-lg bg-purple-100 p-2">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
