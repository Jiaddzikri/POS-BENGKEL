import { ReactNode } from 'react';

interface DashboardTableProps {
  children: ReactNode;
}

export default function DashboardTable({ children }: DashboardTableProps) {
  return <div className="grid gap-6 md:grid-cols-2">{children}</div>;
}
