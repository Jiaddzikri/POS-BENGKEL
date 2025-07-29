import { ArrowDown, ArrowUp } from 'lucide-react';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
}

export default function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  return (
    <div className="overflow-hidden border sm:rounded-lg">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="mt-2 flex items-center">
              {changeType === 'increase' ? <ArrowUp className="mr-1 h-4 w-4 text-green-500" /> : <ArrowDown className="mr-1 h-4 w-4 text-red-500" />}
              <span className={`text-sm font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>{change}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">{icon}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
