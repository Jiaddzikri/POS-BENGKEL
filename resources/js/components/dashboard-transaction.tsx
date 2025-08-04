import { router } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { ReactNode } from 'react';
import { Button } from './ui/button';

interface DashboardTransactionProps {
  children: ReactNode;
}

export default function DashboardTransactions({ children }: DashboardTransactionProps) {
  return (
    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transaksi Terbaru</h3>

        <Button
          onClick={() => router.get(route('transaction.index'))}
          className="flex items-center gap-2 bg-blue-600 text-sm text-white hover:bg-blue-700"
        >
          <Eye className="h-4 w-4" />
          Lihat Semua
        </Button>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
