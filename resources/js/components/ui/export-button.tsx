import { Download } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface ExportButtonProps {
  href: string;
}

export default function ExportButton({ href }: ExportButtonProps) {
  return (
    <Link
      href={href}
      className="flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
    >
      <Download className="h-4 w-4 mr-2" />
      Export
    </Link>
  );
}
