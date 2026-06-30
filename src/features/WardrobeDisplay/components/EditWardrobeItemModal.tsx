import { clothingCategories, type ClothingCategory } from "../../../constants/Categories";


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
        <div>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-lg">
                    <h2 className="mb-4 text-xl font-semibold">Edit Clothing Details</h2>

                    {stickerUrl && (
                        <img
                            src={stickerUrl}
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
                            value={editItemName}
                            onChange={(e) => onEditedItemNameChange(e.target.value)}
                            maxLength={30}
                            // placeholder="e.g. White linen shirt"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="mb-1 block text-sm font-medium">Category</label>

                        <select
                            value={editCategory}
                            onChange={(e) => onEditedCategoryChange(e.target.value as ClothingCategory)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                        >
                            {/* <option value="">Select a category</option> */}

                            {clothingCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {editingSuccessMessage && (
                        <p className="text-green-500">{editingSuccessMessage}</p>
                    )}
                    {editingModalError && (
                        <p className="text-red-500">{editingModalError}</p>
                    )}

                    <div className="flex justify-end gap-3">
                    <button
                            onClick={onDelete}
                            className="rounded-lg bg-red-300 px-4 py-2 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete Item"}
                        </button>

                        <button
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onSave}
                            className="rounded-lg bg-black px-4 py-2 text-white"
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
