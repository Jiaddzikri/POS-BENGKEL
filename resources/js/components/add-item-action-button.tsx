export default function AddItemActionButton() {
  return (
    <div className="flex items-center justify-start space-x-3 pt-6">
      <button
        type="submit"
        className="rounded-md border border-transparent bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Tambah Item
      </button>
    </div>
  );
}
