import { clothingCategories, type ClothingCategory } from "../../../constants/Categories";
import { IoIosArrowDown } from "react-icons/io";


interface EditingWardrobeItemModalProps {
    editItemId: number | null;
    stickerUrl: string | null; //bg removed
    editItemName: string;
    editCategory: ClothingCategory | "";
    isEditSaving: boolean;
    isEditModalOpen: boolean;
    editingSuccessMessage: string | null;
    editingModalError: string | null,
    isDeleting: boolean;
    onEditedItemNameChange: (value: string) => void;
    onEditedCategoryChange: (value: ClothingCategory) => void;
    onDelete: () => void;
    onSave: () => void;
    onClose: () => void
}

const EditWardrobeItemModal = ({
    stickerUrl, //bg removed
    editItemName,
    editCategory,
    isEditSaving,
    editingSuccessMessage,
    editingModalError,
    isDeleting,
    onEditedItemNameChange,
    onEditedCategoryChange,
    onDelete,
    onSave,
    onClose
}: EditingWardrobeItemModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-semibold">Edit Clothing Details</h2>

                {stickerUrl && (
                    <img
                        src={stickerUrl}
                        alt="Clothing with BG removed"
                        className="mb-2 h-36 md:mb-4 md:h-48 w-full rounded-lg object-contain"
                    />
                )}

                <div className="mb-4">
                    <label className="mb-1 block text-xs md:text-sm font-medium">
                        Clothing Name
                    </label>

                    <input
                        type="text"
                        value={editItemName}
                        onChange={(e) => onEditedItemNameChange(e.target.value)}
                        maxLength={30}
                        // placeholder="e.g. White linen shirt"
                        className="text-sm md:text-base w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                    />
                </div>

                <div className="mb-6">
                    <label className="mb-1 block text-xs md:text-sm font-medium">Category</label>

                    <div className="relative w-full">
                        <select
                            value={editCategory}
                            onChange={(e) => onEditedCategoryChange(e.target.value as ClothingCategory)}
                            className="text-sm appearance-none md:text-base w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                        >
                            {/* <option value="">Select a category</option> */}

                            {clothingCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}

                        </select>
                        <IoIosArrowDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-700" />
                    </div>


                </div>

                {editingSuccessMessage && (
                    <p className="text-xs md:text-base text-green-500 mb-6">{editingSuccessMessage}</p>
                )}
                {editingModalError && (
                    <p className="text-xs md:text-base text-red-500 mb-6">{editingModalError}</p>
                )}

                <div className="w-full flex justify-between">
                    <button
                        onClick={onDelete}
                        className="text-xs md:text-base rounded-lg text-blue-400 hover:text-blue-500"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete Item"}
                    </button>
                    <div className="flex space-x-3">

                        <button
                            onClick={onClose}
                            className="text-xs md:text-base rounded-lg px-4 py-2
                             bg-blue-100/50 text-blue-400 hover:bg-blue-100 "
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onSave}
                            className="text-xs md:text-base rounded-lg px-4 py-2
                            bg-blue-500/80 text-white ring-1 ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]
                        enabled:hover:bg-blue-500"
                            disabled={isEditSaving}
                        >
                            {isEditSaving ? "Saving..." : "Save Item"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditWardrobeItemModal
