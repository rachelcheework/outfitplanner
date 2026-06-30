import supabase from '../../../supabase-client';
import { BUCKET_NAME, CLOTHES_TABLE } from "../../../constants/TableNames";
import { useCallback, useReducer } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { removeBackground } from "@imgly/background-removal";
import ClothingDetailsPopup from "../components/ClothingDetailsPopup";
import dndReducer, { initialUploadState } from "../reducers/dndReducer";

const Dnd = () => {
    //dndReducer
    const [dndState, dndDispatch] = useReducer(dndReducer, initialUploadState);
    const {
        previewUrl,
        stickerUrl,
        stickerBlob,
        itemName,
        category,
        isRemovingBackground,
        isSaving,
        dropzoneError,
        modalError,
        successMessage,
        isModalOpen,
    } = dndState;

    //DROPZONE/UPLOAD ACCEPTANCE LOGIC
    const onDrop = useCallback(async (acceptedFiles: File[]) => {

        const file = acceptedFiles[0]; //only takes in the first file 
        if (!file) return;

        try {
            //upload
            const generatedPreviewUrl = URL.createObjectURL(file);
            dndDispatch({ type: "UPLOAD_STARTED", payload: { previewUrl: generatedPreviewUrl } })

            //bg removal
            const generatedStickerBlob = await removeBackground(file);
            const generatedStickerUrl = URL.createObjectURL(generatedStickerBlob); //temporary url
            dndDispatch({ type: "BACKGROUND_REMOVAL_SUCCEEDED", payload: { stickerUrl: generatedStickerUrl, stickerBlob: generatedStickerBlob } })


        } catch (err) {
            //bg removal error
            console.error(err);

            dndDispatch({ type: "BACKGROUND_REMOVAL_FAILED", payload: { message: "Background removal failed" } });
        }

        console.log("accepted:", acceptedFiles);
    }, []);

    //UPLOAD ERROR HANDLING LOGIC
    const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
        if (fileRejections.length === 0) return;

        const firstRejection = fileRejections[0];
        const firstError = firstRejection.errors[0];

        if (!firstError) {
            dndDispatch({ type: "DROPZONE_REJECTED", payload: { message: "File upload failed." } })
            return;
        }

        switch (firstError.code) {
            case "file-invalid-type":
                dndDispatch({ type: "DROPZONE_REJECTED", payload: { message: "Please upload a JPG or PNG image." } })
                break;
            case "file-too-large":
                dndDispatch({ type: "DROPZONE_REJECTED", payload: { message: "File is too large. Please upload an image under 5MB." } })
                break;
            case "too-many-files":
                dndDispatch({ type: "DROPZONE_REJECTED", payload: { message: "Please upload only one image." } })
                break;
            default:
                dndDispatch({ type: "DROPZONE_REJECTED", payload: { message: firstError.message } })
        }
    }, []);

    //DROPZONE SETTINGS
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        accept: { "image/*": [] },
        maxSize: 5 * 1024 * 1024,
        multiple: false,
    });

    //DROPZONE REDO
    const redo = () => {
        dndDispatch({ type: "RESET" });
    };

    //MODAL CANCEL
    const handleCancel = () => {
        dndDispatch({ type: "CLOSE_MODAL" })
    };

    //MODAL SAVE/BACKEND UPLOAD
    const handleSave = async () => {
        try {
            dndDispatch({ type: "SAVE_STARTED" });

            // validate item name & category
            if (itemName?.trim() === "") {
                dndDispatch({ type: "SAVE_FAILED", payload: { message: "Please enter an item name." } })
                return;
            }

            if (category === "") {
                dndDispatch({ type: "SAVE_FAILED", payload: { message: "Please select a category." } })
                return;
            }

            //get logged-in user
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            //not sure if i need this but it keeps flagging an error if i dont include
            if (userError || !user) {
                dndDispatch({ type: "SAVE_FAILED", payload: { message: "You must be logged in to save an item." } });
                return;
            }


            //create a unique file path for upload
            const fileExt = "png";
            const fileName = `${crypto.randomUUID()}.${fileExt}`;

            //example path: user-id/tops/random-file-name.png
            const filePath = `${user.id}/${category}/${fileName}`;

            //upload image to Supabase bucket
            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, stickerBlob, {
                    contentType: "image/png",
                    upsert: false,
                });

            if (uploadError) {
                console.error(uploadError);
                dndDispatch({ type: "SAVE_FAILED", payload: { message: "Failed to upload image." } });
                return;
            }

            //insert item details into database
            const { error: insertError } = await supabase
                .from(CLOTHES_TABLE)
                .insert({
                    user_id: user.id,
                    item_name: itemName.trim(),
                    category,
                    image_path: filePath,
                });

            if (insertError) {
                console.error(insertError);
                dndDispatch({ type: "SAVE_FAILED", payload: { message: "Image uploaded, but failed to save item details." } });
                return;
            }

            //resetting ui after successful save
            redo();
            dndDispatch({ type: "SAVE_SUCCEEDED", payload: { message: "Image saved successfully!" } })

        } catch (err) {
            console.error(err);
            dndDispatch({ type: "SAVE_FAILED", payload: { message: "Something went wrong while saving." } });
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 p-8">

            {/* Dropzone */}
            {!isRemovingBackground && stickerUrl === null && (<div
                {...getRootProps()}
                className={`w-96 h-60 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition
        ${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"}`}
            >
                <input {...getInputProps()} />

                {isDragActive ? (
                    <p className="text-gray-600">Drop the image here...</p>
                ) : (
                    <div className="text-center text-gray-600">
                        <p className="font-medium">Drag & drop clothing image</p>
                        <p className="text-sm">or click to upload</p>
                    </div>
                )}
            </div>)}

            {/* Loading */}
            {isRemovingBackground && (
                <div className="flex flex-col items-center">
                    <p className="text-blue-400 font-medium">
                        Removing background...
                    </p>
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent"></div>
                </div>

            )}

            {/* Error */}
            {dropzoneError && (
                <p className="text-red-500">{dropzoneError}</p>
            )}

            {/* Success */}
            {successMessage && (
                <p className="text-green-500">{successMessage}</p>
            )}

            {/* Preview */}
            {previewUrl && !stickerUrl && (
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-gray-500">Image Selected</p>
                    <img
                        src={previewUrl}
                        alt="preview"
                        className="max-w-xs rounded-lg shadow"
                    />
                </div>
            )}

            {/* Final sticker */}
            {stickerUrl && (
                <div className="flex flex-col items-center space-y-6">
                    <p className="text-sm text-gray-500">Sticker</p>
                    <img
                        src={stickerUrl}
                        alt="sticker"
                        className="max-w-xs rounded-lg shadow"
                    />
                    <div className="flex space-x-3">
                        <button className="border border-gray-500 rounded-xl p-3 hover:bg-gray-500 hover:text-white" onClick={redo}>Redo</button>
                        <button
                            className="border border-blue-400 rounded-xl p-3 bg-blue-400 text-white hover:bg-white hover:text-blue-400"
                            onClick={() => dndDispatch({ type: "OPEN_MODAL" })}
                        >Add to Wardrobe</button>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {isModalOpen && (
                <ClothingDetailsPopup
                    sticker={stickerUrl}
                    itemName={itemName}
                    category={category}
                    onCancel={handleCancel}
                    onSave={handleSave}
                    saving={isSaving}
                    modalError={modalError}
                    onItemNameChange={(value) =>
                        dndDispatch({
                            type: "SET_ITEM_NAME",
                            payload: { itemName: value },
                        })
                    }
                    onCategoryChange={(value) =>
                        dndDispatch({
                            type: "SET_CATEGORY",
                            payload: { category: value },
                        })
                    }
                />
            )}
        </div>
    );
};

export default Dnd;