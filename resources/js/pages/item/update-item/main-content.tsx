import { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  return (
    <div className="space-y-6 px-6 py-2">
      <div className="">
        <h1 className="text-2xl font-semibold">Update Item</h1>
        <p className="mt-1 text-sm">Update your item and its variant</p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">{children}</div>
      </div>
    </div>
  );
}
