import { AlertTriangle, BarChart3, Package, Tag } from 'lucide-react';

export default function ItemStatsCard() {
    return (
        <div className="px-6 py-2">
            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm">Total Items</p>
                            <p className="text-2xl font-semibold">245</p>
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
                            <p className="text-2xl font-semibold">238</p>
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
                            <p className="text-2xl font-semibold text-orange-600">7</p>
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
                            <p className="text-2xl font-semibold">6</p>
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
