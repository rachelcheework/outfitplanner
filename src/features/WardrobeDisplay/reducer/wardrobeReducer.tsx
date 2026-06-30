import type { ClothingCategory } from "../../../constants/Categories";

//state type definition
export type EditingModalState = {
    editStickerUrl: string | null, //after bg removed

    //modal
    editItemId: number | null;
    editItemName: string | "",
    editCategory: ClothingCategory | "",
    editItemImagePath: string | "", //to help delete from bucket
    isEditSaving: boolean,
    isEditModalOpen: boolean,
    editingSuccessMessage: string | null,
    editingModalError: string | null,
    isDeleting: boolean,
}

//initial state
export const initialEditingState: EditingModalState = {
    editItemId: null,
    editStickerUrl: null,
    editItemName: "", //pass the pre-existing itemName via payload
    editCategory: "", //pass the pre-existing category via payload
    editItemImagePath: "", //pass the pre-existing image_path via payload
    isEditSaving: false,
    isEditModalOpen: false,
    editingSuccessMessage: null,
    editingModalError: null,
    isDeleting: false,
}


//action type definition
export type EditActions =
    | {
        type: "OPEN_EDIT_MODAL";
        payload: {
            id: number,
            itemName: string;
            category: ClothingCategory;
            image_path: string; //to help delete from bucket
            stickerUrl: string | null; // REMOVE NULL?
        };
    }
    | {
        type: "CLOSE_EDIT_MODAL";
    }
    | {
        type: "SET_EDITED_ITEM_NAME";
        payload: {
            itemName: string;
        };
    }
    | {
        type: "SET_EDITED_CATEGORY";
        payload: {
            category: ClothingCategory;
        };
    }
    | {
        type: "EDIT_SAVE_STARTED";
    }
    | {
        type: "EDIT_SAVE_SUCCEEDED";
        payload: {
            message: string;
        };
    }
    | {
        type: "EDIT_SAVE_FAILED";
        payload: {
            message: string;
        };
    }
    | {
        type: "DELETE_STARTED";
    }
    | {
        type: "DELETE_SUCCEEDED";
        payload: {
            message: string;
        }
    }
    | {
        type: "DELETE_FAILED";
        payload: {
            message: string;
        }
    }
    | {
        type: "RESET";
    };


//reducer
function wardrobeReducer(state: EditingModalState, action: EditActions): EditingModalState {
    switch (action.type) {

        case "OPEN_EDIT_MODAL":
            return {
                ...state,
                editItemId: action.payload.id,
                editItemName: action.payload.itemName,
                editCategory: action.payload.category,
                editItemImagePath: action.payload.image_path, //to help delete in bucket
                editStickerUrl: action.payload.stickerUrl,
                isEditModalOpen: true,
                editingSuccessMessage: null,
                editingModalError: null,
                
            };
        case "CLOSE_EDIT_MODAL":
            return {
                ...state,
                editItemName: "",
                editCategory: "",
                editStickerUrl: null,
                isEditModalOpen: false,
                editingModalError: null,
            };
            case "SET_EDITED_ITEM_NAME":
            return {
                ...state,
                editItemName: action.payload.itemName,
            };

        case "SET_EDITED_CATEGORY":
            return {
                ...state,
                editCategory: action.payload.category,
            };

        case "EDIT_SAVE_STARTED":
            return {
                ...state,
                isEditSaving: true,
                editingModalError: null,
            };

        case "EDIT_SAVE_SUCCEEDED":
            return {
                ...state,
                isEditSaving: false,
                editingSuccessMessage: action.payload.message,
                editingModalError: null,
            };

        case "EDIT_SAVE_FAILED":
            return {
                ...state,
                isEditSaving: false,
                editingSuccessMessage: null,
                editingModalError: action.payload.message,
            };
        case "DELETE_STARTED":
            return {
                ...state,
                isDeleting: true,
                editingModalError: null,
            };

        case "DELETE_SUCCEEDED":
            return {
                ...state,
                isDeleting: false,
                editingSuccessMessage: action.payload.message,
                editingModalError: null
            };

        case "DELETE_FAILED":
            return {
                ...state,
                isDeleting: false,
                editingSuccessMessage: null,
                editingModalError: action.payload.message
            };

        case "RESET":
            return initialEditingState;

        default:
            return state;
    }
};

export default wardrobeReducer;
