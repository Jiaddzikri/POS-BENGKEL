export default function AddItemActionButton() {
  return (
    <div className="flex items-center justify-start space-x-3 pt-6">
      <button className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
        Cancel
      </button>
      <button className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
        Save as Draft
      </button>
      <button
        type="submit"
        className="rounded-md border border-transparent bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Save & Publish
      </button>
    </div>
  );
}
