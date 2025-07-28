import { InventoryStats as InventoryStatsType } from '@/types';
import { AlertTriangle, BarChart3, MoveDown, Package } from 'lucide-react';

interface InventoryStatsProps {
  stats: InventoryStatsType;
}

export default function InventoryStats({ stats }: InventoryStatsProps) {
  return (
    <div className="px-6 py-2">
      {/* Stats Cards */}
      <div className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Total Active Items</p>
              <p className="text-2xl font-semibold">{stats.active_item}</p>
            </div>
            <div className="rounded-lg bg-blue-100 p-2">
              <Package className="h-6 w-6 text-blue-600" />
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
              <p className="text-sm">Out of Stock</p>
              <p className="text-2xl font-semibold">{stats.out_of_stock}</p>
            </div>
            <div className="rounded-lg bg-red-100 p-2">
              <MoveDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Stock Movements</p>
              <p className="text-2xl font-semibold">{stats.stock_movement}</p>
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
