interface AnalyticPaymentMethodProps {
  method: string;
  transactions: number;
  percentage: number;
  icon: React.ReactNode;
}
export default function AnalyticPaymentMethod({ method, transactions, percentage, icon }: AnalyticPaymentMethodProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium text-gray-900">{method}</span>
        </div>
        <span className="text-xs text-gray-500">{percentage}%</span>
      </div>
      <div className="mb-2 h-2 w-full rounded-full bg-gray-200">
        <div className="h-2 rounded-full bg-indigo-600 transition-all duration-300" style={{ width: `${percentage}%` }}></div>
      </div>
      <p className="text-xs text-gray-500">{transactions} transaksi</p>
    </div>
  );
}
