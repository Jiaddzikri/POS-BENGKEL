import { Save } from "lucide-react";


interface ActionButtonProps {
  backLink: string;
}

export default function ActionButton({ backLink }: ActionButtonProps) {

  const handleBack = () => window.location.href = backLink;
  return (
    <div className="flex items-center justify-start space-x-3 pt-6">
      <button onClick={handleBack} className="rounded-md border border-gray-300 px-6 py-2 text-sm font-medium text-gray-100 transition-colors hover:bg-gray-50 hover:text-gray-900">
        Cancel
      </button>
      <button
        type="submit"
        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        <Save className="mr-2 h-4 w-4" />
        Save & Publish
      </button>
    </div>
  );
}