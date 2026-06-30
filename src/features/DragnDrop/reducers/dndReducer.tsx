import type { ClothingCategory } from "../../../constants/Categories";

//state type definition
export type UploadState = {

    //pic upload/bg removal
    previewUrl: string | null, //before bg removed
    isRemovingBackground: boolean, //while bg removed
    stickerUrl: string | null, //after bg removed

    dropzoneError: string | null,

    //modal
    itemName: string | "",
    category: ClothingCategory | "",
    stickerBlob: Blob | null, //to upload img into supabase
    isSaving: boolean,

    isModalOpen: boolean,
    successMessage: string | null,
    modalError: string | null,


}

//initial state
export const initialUploadState: UploadState = {
    previewUrl: null,
    isRemovingBackground: false,
    stickerUrl: null,

    dropzoneError: null,

    itemName: "",
    category: "",
    stickerBlob: null,

    isSaving: false,
    isModalOpen: false,
    successMessage: null,
    modalError: null
}


//action type definition
export type UploadActions =
    {
        type: "UPLOAD_STARTED";
        payload: {
            previewUrl: string
        };
    }
    |
    {
        type: "DROPZONE_REJECTED";
        payload: {
            message: string
        }
    }
    | {
        type: "BACKGROUND_REMOVAL_SUCCEEDED";
        payload: {
            stickerUrl: string;
            stickerBlob: Blob;
        };
    }
    | {
        type: "BACKGROUND_REMOVAL_FAILED";
        payload: {
            message: string;
        };
    }
    | {
        type: "OPEN_MODAL";
    }
    | {
        type: "CLOSE_MODAL";
    }
    | {
        type: "SET_ITEM_NAME";
        payload: {
            itemName: string;
        };
    }
    | {
        type: "SET_CATEGORY";
        payload: {
            category: ClothingCategory | "";
        };
    }
    | {
        type: "SAVE_STARTED";
    }
    | {
        type: "SAVE_SUCCEEDED";
        payload: {
            message: string;
        };
    }
    | {
        type: "SAVE_FAILED";
        payload: {
            message: string;
        };
    }
    | {
        type: "RESET";
    };


//reducer
function dndReducer(state: UploadState, action: UploadActions): UploadState {
    switch (action.type) {

        case "UPLOAD_STARTED":
            return {
                ...state,
                previewUrl: action.payload.previewUrl,
                isRemovingBackground: true,
                stickerUrl: null,
                stickerBlob: null,
                dropzoneError: null,
                successMessage: null,
                isModalOpen: false,
            };

        case "DROPZONE_REJECTED":
            return {
                ...state,
                dropzoneError: action.payload.message,
                successMessage: null
            };

        case "BACKGROUND_REMOVAL_SUCCEEDED":
            return {
                ...state,
                isRemovingBackground: false,
                stickerUrl: action.payload.stickerUrl,
                stickerBlob: action.payload.stickerBlob,
                dropzoneError: null,
                successMessage: null
            };

        case "BACKGROUND_REMOVAL_FAILED":
            return {
                ...state,
                isRemovingBackground: false,
                dropzoneError: action.payload.message,
                successMessage: null
            };

        case "OPEN_MODAL":
            return {
                ...state,
                isModalOpen: true,
                modalError: null,
            };

        case "CLOSE_MODAL":
            return {
                ...state,
                itemName: "",
                category: "",
                isModalOpen: false,
                modalError: null,
            };

        case "SET_ITEM_NAME":
            return {
                ...state,
                itemName: action.payload.itemName,
            };

        case "SET_CATEGORY":
            return {
                ...state,
                category: action.payload.category,
            };

        case "SAVE_STARTED":
            return {
                ...state,
                isSaving: true,
                modalError: null,
            };

        case "SAVE_SUCCEEDED":
            return {
                ...initialUploadState,
                isSaving: false,
                successMessage: action.payload.message,
                modalError: null
            };

        case "SAVE_FAILED":
            return {
                ...state,
                isSaving: false,
                successMessage: null,
                modalError: action.payload.message,
            };

        case "RESET":
            return initialUploadState;

        default:
            return state;
    }
};

export default dndReducer;
