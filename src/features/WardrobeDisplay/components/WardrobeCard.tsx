import { useQueryClient } from "@tanstack/react-query";
import type { ClothingCategory } from "../../../constants/Categories";
import { BUCKET_NAME, CLOTHES_TABLE } from "../../../constants/TableNames";
import EditWardrobeItemModal from "./EditWardrobeItemModal";
import { useReducer } from "react";
import wardrobeReducer, { initialEditingState } from "../reducer/wardrobeReducer";
import supabase from "../../../supabase-client";

//data from table
export type ClothingItem = {
  id: number;
  itemName: string;
  category: ClothingCategory;
  image_path: string;
  stickerUrl: string | null
};

export default function WardrobeCard({
  id,
  itemName,
  category,
  image_path,
  stickerUrl
}: ClothingItem) {

  const queryClient = useQueryClient();

  //reducer
  const [editState, editDispatch] = useReducer(wardrobeReducer, initialEditingState);
  const {
    editItemId,
    editItemName,
    editCategory,
    editItemImagePath, //to help delete from bucket later
    isEditSaving,
    isEditModalOpen,
    editingSuccessMessage,
    editingModalError,
    isDeleting,
  } = editState;

  //open edit modal - i need imageUrl here for display purposes
  const openEditModal = (
    { id,
      itemName,
      category,
      image_path,
      stickerUrl }
      : ClothingItem) => {
    editDispatch({
      type: "OPEN_EDIT_MODAL", payload: {
        id,
        itemName,
        category,
        image_path,
        stickerUrl
      }
    })
  }

  //close edit modal
  const closeEditModal = () => {
    editDispatch({ type: "CLOSE_EDIT_MODAL" })
  };


  //save edits
  const saveEditedItem = async () => {
    if (editItemId === null) { return };

    try {
      editDispatch({ type: "EDIT_SAVE_STARTED" });

      if (editItemName?.trim() === "") {
        editDispatch({ type: "EDIT_SAVE_FAILED", payload: { message: "Please enter an item name." } })
        return;
      }

      //get logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      //not sure if i need this but it keeps flagging an error if i dont include
      if (userError || !user) {
        editDispatch({ type: "EDIT_SAVE_FAILED", payload: { message: "You must be logged in to save an item." } });
        return;
      }

      //update in supabase table NOT bucket
      const { error: updateError } = await supabase
        .from(CLOTHES_TABLE)
        .update({
          item_name: editItemName.trim(),
          category: editCategory,
        })
        .eq("id", editItemId);

      if (updateError) {
        console.error(updateError)
        editDispatch({ type: "EDIT_SAVE_FAILED", payload: { message: "Failed to update successfully." } })
      }

      //invalidate query so tanstack query will auto refetch and update data
      await queryClient.invalidateQueries({
        queryKey: ["clothes", category],
      });

      editDispatch({ type: "EDIT_SAVE_SUCCEEDED", payload: { message: "Image details updated successfully!" } });


      (setTimeout(() => {
        editDispatch({ type: "CLOSE_EDIT_MODAL" })
      }, 1000));
    } catch (err) {
      console.error(err);
      editDispatch({ type: "EDIT_SAVE_FAILED", payload: { message: "Something went wrong while updating." } });
    }
  };;


  //delete item
  const deleteWardrobeItem = async () => {
    if (editItemId === null) {
      return;
    }

    editDispatch({ type: "DELETE_STARTED" });

    try {
      //delete from bucket 
      if (editItemImagePath) {
        const { error: storageError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([editItemImagePath]);

        if (storageError) {
          throw new Error(storageError.message);
        }
      }

      //delete from clothes table
      const { error: deleteError } = await supabase
        .from(CLOTHES_TABLE)
        .delete()
        .eq("id", editItemId);

      if (deleteError) {
        console.error(deleteError)
        editDispatch({ type: "DELETE_FAILED", payload: { message: "Failed to delete successfully." } })
      }


      //invalidate query so tanstack query will auto refetch and update data
      await queryClient.invalidateQueries({
        queryKey: ["clothes", category],
      });
      
      editDispatch({
        type: "DELETE_SUCCEEDED",
        payload: {
          message: "Item deleted successfully.",
        },
      });


      setTimeout(() => {
        editDispatch({ type: "CLOSE_EDIT_MODAL" })
      }, 1000);

    } catch (err) {
      console.error(err);
      editDispatch({ type: "DELETE_FAILED", payload: { message: "Something went wrong while deleting." } });
    }
  };

  return (
    <div
      className="rounded-xl border border-slate-200 p-4"
    >
      <button
        onClick={() => openEditModal({ id, itemName, category, image_path, stickerUrl })}
      >

        {stickerUrl ? (
          <img
            src={stickerUrl}
            alt={itemName}
            className="h-48 w-full rounded-lg object-contain"
          />
        ) : (
          <div className="flex h-48 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            No image
          </div>
        )}

        <p className="mt-3 font-medium text-slate-800">{itemName}</p>

        <p className="text-sm capitalize text-slate-500">{category}</p>
      </button>

      {isEditModalOpen && (<EditWardrobeItemModal
        editItemId={editItemId}
        stickerUrl={stickerUrl}
        editItemName={editItemName}
        editCategory={editCategory}
        isEditSaving={isEditSaving}
        isEditModalOpen={isEditModalOpen}
        editingSuccessMessage={editingSuccessMessage}
        editingModalError={editingModalError}
        isDeleting={isDeleting}
        onDelete={deleteWardrobeItem}
        onSave={saveEditedItem}
        onClose={closeEditModal}
        onEditedItemNameChange={(value) =>
          editDispatch({
            type: "SET_EDITED_ITEM_NAME",
            payload: { itemName: value },
          })
        }
        onEditedCategoryChange={(value) =>
          editDispatch({
            type: "SET_EDITED_CATEGORY",
            payload: { category: value },
          })
        }
      />)}
    </div>
  );
}

