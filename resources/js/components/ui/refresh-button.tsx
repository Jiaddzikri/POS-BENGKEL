import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RefreshButtonProps {
  onClick: () => void;
  isRefreshing: boolean;
}

export default function RefreshButton({ onClick, isRefreshing }: RefreshButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      Refresh
    </Button>
  );
}
