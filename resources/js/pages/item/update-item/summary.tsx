import { Variant } from '@/types';

interface SummaryProps {
  variants: Variant[];
}

export default function Summary({ variants }: SummaryProps) {
  return (
    <div className="rounded-lg border">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-medium">Ringkasan</h2>
      </div>
      <div className="space-y-3 px-6 py-4">
        <div className="flex justify-between">
          <span className="text-sm">Total Variant:</span>
          <span className="text-sm font-medium">{variants.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Total Stock:</span>
          <span className="text-sm font-medium">{variants.reduce((sum, v) => sum + v.stock, 0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Harga Terendah:</span>
          <span className="text-sm font-medium">Rp {Math.min(...variants.map((v) => v.additional_price)).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Harga Tertinggi:</span>
          <span className="text-sm font-medium">Rp {Math.max(...variants.map((v) => v.additional_price)).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
