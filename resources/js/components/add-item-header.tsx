export default function AddItemHeader() {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-semibold">Add New Item</h1>
            <p className="mt-1 text-sm">Create a new product for your inventory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
