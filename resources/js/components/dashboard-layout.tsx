import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">{children}</div>;
}
