import { ReactNode } from 'react';

interface DashboardChartProps {
  children: ReactNode;
}

export default function DashboardChart({ children }: DashboardChartProps) {
  return <div className="grid gap-6 md:grid-cols-2">{children}</div>;
}
