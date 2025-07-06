import { ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return <div className="space-y-6">{children}</div>;
}
