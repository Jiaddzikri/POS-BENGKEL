import { DashboardTransaction } from '@/types';
import { numberFormat } from '@/utils/number-format';

interface DashboardTransactionTableProps {
  newestTransactions: DashboardTransaction[];
}

export default function DashboardTransactionTable({ newestTransactions }: DashboardTransactionTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">ID Transaksi</th>
          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Jam</th>
          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Pelanggan</th>
          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Items</th>
          <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Total</th>
        </tr>
      </thead>
      <tbody>
        {newestTransactions.map((transaction: DashboardTransaction) => (
          <tr key={transaction.transaction_id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{transaction.transaction_id}</td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{transaction.transaction_time}</td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{transaction.buyer_name}</td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{transaction.total_items} item</td>
            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Rp {numberFormat(transaction.final_amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
