import { clothingCategories, type ClothingCategory } from "../../../constants/Categories";
import { IoIosArrowDown } from "react-icons/io";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* <div className="flex flex-col space-between h-1/2 lg:h-3/4 w-3/4 max-w-md rounded-2xl bg-white p-6 shadow-lg"> */}
      <div
        className="
        w-full max-w-md
        max-h-[90dvh]
        overflow-y-auto
        rounded-2xl bg-white
        p-5 sm:p-6
        shadow-lg
      "
      >
        {/* <h2 className="text-gray-800 text-base md:text-xl font-semibold"> */}
        <h2 className="mb-5 text-base font-semibold text-gray-800 sm:text-xl">
          Add Clothing Details</h2>

        <div className="flex flex-col gap-4">
          {sticker && (
            <div className="flex h-40 items-center justify-center rounded-lg bg-gray-100 sm:h-52">
            <img
              src={sticker}
              alt="Clothing with BG removed"
              className="h-full w-full rounded-lg bg-gray-100 object-contain"
            />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-800 sm:text-sm">
              Clothing Name
            </label>

            <input
              type="text"
              value={itemName}
              onChange={(e) => onItemNameChange(e.target.value)}
              maxLength={30}
              placeholder="e.g. White linen shirt"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base text-gray-800 outline-none focus:border-gray-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-800 text-xs sm:text-sm font-medium">Category</label>

            <div className="relative w-full">

              <select
                value={category}
                onChange={(e) => onCategoryChange(e.target.value as ClothingCategory)}
                className="appearance-none w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base text-gray-800 outline-none focus:border-gray-800"
              >
                <option value="">Select a category</option>

                {clothingCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <IoIosArrowDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-700" />
            </div>
          </div>

          {modalError && (
            <p className="text-red-500 text-xs sm:text-sm">{modalError}</p>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="text-sm rounded-xl sm:text-base md:rounded-lg px-4 py-2 bg-blue-100/50 text-blue-400 hover:bg-blue-100 "
            >
              Cancel
            </button>

            <button
              onClick={onSave}
              className="text-sm rounded-xl md:text-base md:rounded-lg px-4 py-2 bg-blue-500/80 text-white ring-1 ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]
                        hover:bg-blue-500"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Item"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClothingDetailsPopup
