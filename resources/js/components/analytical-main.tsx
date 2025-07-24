import { ReactNode } from 'react';

interface AnalyticalMainProps {
  children: ReactNode;
}

export default function AnalyticalMain({ children }: AnalyticalMainProps) {
  return <div className="min-h-screen">{children}</div>;
}
