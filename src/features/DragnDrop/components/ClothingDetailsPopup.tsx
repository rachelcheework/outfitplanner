import { clothingCategories, type ClothingCategory } from "../../../constants/Categories";

export interface ClothingDetailsModalProps {
  sticker: string | null;
  itemName: string;
  category: ClothingCategory | "";
  onCancel: () => void;
  onSave: () => void;
  saving: boolean
  modalError: string | null;
  onItemNameChange: (value: string) => void;
  onCategoryChange: (value: ClothingCategory) => void;
}

const ClothingDetailsPopup = ({
  sticker,
  itemName,
  category,
  onCancel,
  onSave,
  saving,
  modalError,
  onItemNameChange,
  onCategoryChange,
}: ClothingDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Add Clothing Details</h2>

        {sticker && (
          <img
            src={sticker}
            alt="Clothing with BG removed"
            className="mb-4 h-48 w-full rounded-lg bg-gray-100 object-contain"
          />
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">
            Clothing Name
          </label>

          <input
            type="text"
            value={itemName}
            onChange={(e) => onItemNameChange(e.target.value)}
            maxLength={30}
            placeholder="e.g. White linen shirt"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium">Category</label>

          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as ClothingCategory)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
          >
            <option value="">Select a category</option>

            {clothingCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {modalError && (
                <p className="text-red-500">{modalError}</p>
            )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="rounded-lg bg-black px-4 py-2 text-white"
            disabled={saving}
          >
             {saving ? "Saving..." : "Save Item"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClothingDetailsPopup
