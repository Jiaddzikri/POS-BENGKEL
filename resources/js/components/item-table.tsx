import { AlertTriangle, Edit3, Eye, MoreVertical, Package, Trash2 } from 'lucide-react';
export default function ItemTable() {
    const items = [
        {
            id: 1,
            name: 'Nasi Gudeg Special',
            category: 'Food',
            price: 15000,
            stock: 25,
            sku: 'F001',
            status: 'Active',
            lowStock: false,
            lastUpdated: '2 hours ago',
        },
        {
            id: 2,
            name: 'Es Teh Manis',
            category: 'Beverages',
            price: 5000,
            stock: 50,
            sku: 'D001',
            status: 'Active',
            lowStock: false,
            lastUpdated: '1 day ago',
        },
        {
            id: 3,
            name: 'Keripik Singkong',
            category: 'Snacks',
            price: 8000,
            stock: 5,
            sku: 'S001',
            status: 'Active',
            lowStock: true,
            lastUpdated: '3 hours ago',
        },
        {
            id: 4,
            name: 'Kopi Tubruk Premium',
            category: 'Beverages',
            price: 7000,
            stock: 30,
            sku: 'D002',
            status: 'Active',
            lowStock: false,
            lastUpdated: '5 hours ago',
        },
        {
            id: 5,
            name: 'Ayam Penyet',
            category: 'Food',
            price: 18000,
            stock: 15,
            sku: 'F002',
            status: 'Inactive',
            lowStock: false,
            lastUpdated: '1 day ago',
        },
    ];
    return (
        <div className="px-6 py-2">
            <div className="rounded-lg border">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b">
                            <tr className="text-center">
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Item</th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">SKU</th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Price</th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Stock</th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase">Last Updated</th>
                                <th className="px-4 py-3 text-center text-xs font-medium tracking-wider uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {items.map((item) => (
                                <tr key={item.id} className="">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center">
                                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg">
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">{item.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="font-mono text-sm">{item.sku}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm">{item.category}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm font-medium">Rp {item.price.toLocaleString('id-ID')}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center">
                                            <span className={`text-sm font-medium ${item.lowStock ? 'text-orange-600' : ''}`}>{item.stock}</span>
                                            {item.lowStock && <AlertTriangle className="ml-2 h-4 w-4 text-orange-500" />}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                item.status === 'Active' ? 'text-green-800' : ''
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm">{item.lastUpdated}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button className="transition-colors hover:text-blue-600">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="transition-colors hover:text-green-600">
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button className="transition-colors hover:text-red-600">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            <button className="transition-colors hover:text-gray-600">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
