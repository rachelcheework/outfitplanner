import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { OUTFITS_TABLE, OUTFIT_BUCKET } from "../../../constants/TableNames";
import type Konva from "konva";
import supabase from "../../../supabase-client";
import type { ClothingItem } from "../../WardrobeDisplay/components/WardrobeCard";
import OutfitCanvas from "../components/OutfitCanvas";
import type { CanvasItem } from "../types/CanvasItem";

import { clothingCategories, type ClothingCategory } from "../../../constants/Categories";
import { useQuery } from "@tanstack/react-query";
import fetchClothesByCategory from "../../../api/fetchClothesByCategory";


import { RiBringForward, RiBringToFront, RiSendToBack, RiSendBackward, RiDeleteBin6Fill, RiSave3Line } from "react-icons/ri";

export default function OutfitPage() {

    const { user } = useAuth();

    const categories = clothingCategories;
    const [outfitCategory, setOutfitCategory] = useState<ClothingCategory>("tops");

    //for mobile category menu dropdown
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

    //saving the canvas
    const stageRef = useRef<Konva.Stage>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

    function waitForNextFrame(): Promise<void> { //check on this
        return new Promise((resolve) => {
            requestAnimationFrame(() => resolve());
        });
    }

    async function saveOutfit() {
        const stage = stageRef.current;

        if (!stage) {
            setSaveError("Canvas is not available.");
            return;
        }

        if (canvasItems.length === 0) {
            setSaveError("Add at least one clothing item first.");
            return;
        }


        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(null);

        try {

            /*
             * Remove the Transformer/selection border before exporting.
             */
            setSelectedId(null);

            /*
             * Give React and Konva time to redraw without the selection.
             */
            await waitForNextFrame();
            await waitForNextFrame();

            const outfitImageBlob = await stage.toBlob({
                mimeType: "image/png",
                pixelRatio: 2,
            });

            if (!outfitImageBlob) {
                throw new Error("Failed to create the outfit image.");
            }

            const fileName = `${crypto.randomUUID()}.png`;
            const outfitImagePath = `${user?.id}/${fileName}`;

            /*
             * First, upload the actual PNG to Storage.
             */
            const { error: uploadError } = await supabase.storage
                .from(OUTFIT_BUCKET)
                .upload(outfitImagePath, outfitImageBlob, {
                    contentType: "image/png",
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) {
                throw uploadError;
            }

            /*
             * Then save its path and metadata in the database table.
             */
            const { error: insertError } = await supabase
                .from(OUTFITS_TABLE)
                .insert({
                    user_id: user?.id,
                    outfit_image_path: outfitImagePath,
                });

            if (insertError) {
                /*
                 * The image was uploaded, but the row failed.
                 * Remove the uploaded image to avoid an orphaned file.
                 */
                await supabase.storage
                    .from(OUTFIT_BUCKET)
                    .remove([outfitImagePath]);

                throw insertError;
            }

            setSaveSuccess("Outfit saved successfully.");
        } catch (error) {
            setSaveError(
                error instanceof Error
                    ? error.message
                    : "Failed to save the outfit.",
            );
        } finally {
            setIsSaving(false);
        }
    }

    const {
        data: items = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["clothes", user?.id, outfitCategory],
        queryFn: () => fetchClothesByCategory(user!.id, outfitCategory!),
        enabled: !!user && !!outfitCategory //query is only enabled if user and outfitCategory exists
    });

    const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    function addClothingItem(item: ClothingItem) {
        if (!item.image_path) {
            return;
        }

        const image = new window.Image();

        image.onload = () => {
            const maxSize = 150;

            const scale = Math.min(
                maxSize / image.width,
                maxSize / image.height
            );

            const newCanvasItem: CanvasItem = {
                id: crypto.randomUUID(),
                imageUrl: item.image_path,
                x: 250,
                y: 200,
                width: image.width * scale,
                height: image.height * scale,
                rotation: 0,
            };

            setCanvasItems((currentItems) => [
                ...currentItems,
                newCanvasItem,
            ]);

            setSelectedId(newCanvasItem.id);
        };

        image.src = item.image_path;
    }

    function deleteSelectedItem() {
        if (!selectedId) {
            return;
        }

        setCanvasItems((currentItems) =>
            currentItems.filter((item) => item.id !== selectedId),
        );

        setSelectedId(null);
    }

    function bringToFront() {
        if (!selectedId) {
            return;
        }

        setCanvasItems((currentItems) => {
            const selectedItem = currentItems.find(
                (item) => item.id === selectedId,
            );

            if (!selectedItem) {
                return currentItems;
            }

            return [
                ...currentItems.filter(
                    (item) => item.id !== selectedId,
                ),
                selectedItem,
            ];
        });
    }

    function sendToBack() {
        if (!selectedId) {
            return;
        }

        setCanvasItems((currentItems) => {
            const selectedItem = currentItems.find(
                (item) => item.id === selectedId,
            );

            if (!selectedItem) {
                return currentItems;
            }

            return [
                selectedItem,
                ...currentItems.filter(
                    (item) => item.id !== selectedId,
                ),
            ];
        });
    }

    function moveForwardOneLayer() {
        if (!selectedId) {
            return;
        }

        setCanvasItems((currentItems) => {
            const selectedIndex = currentItems.findIndex(
                (item) => item.id === selectedId,
            );

            // Item not found, or it is already at the front
            if (
                selectedIndex === -1 ||
                selectedIndex === currentItems.length - 1
            ) {
                return currentItems;
            }

            const updatedItems = [...currentItems];

            [
                updatedItems[selectedIndex],
                updatedItems[selectedIndex + 1],
            ] = [
                    updatedItems[selectedIndex + 1],
                    updatedItems[selectedIndex],
                ];

            return updatedItems;
        });
    }

    function moveBackwardOneLayer() {
        if (!selectedId) {
            return;
        }

        setCanvasItems((currentItems) => {
            const selectedIndex = currentItems.findIndex(
                (item) => item.id === selectedId,
            );

            // Item not found, or it is already at the back
            if (selectedIndex <= 0) {
                return currentItems;
            }

            const updatedItems = [...currentItems];

            [
                updatedItems[selectedIndex],
                updatedItems[selectedIndex - 1],
            ] = [
                    updatedItems[selectedIndex - 1],
                    updatedItems[selectedIndex],
                ];

            return updatedItems;
        });
    }

    //keyboard deletion
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (
                event.key === "Delete" ||
                event.key === "Backspace"
            ) {
                deleteSelectedItem();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedId]);

    if (isLoading) {
        return <p className="text-slate-600">Loading items...</p>;
    }

    if (isError) {
        return (
            <p className="text-red-500">
                {error instanceof Error ? error.message : "Failed to load items."}
            </p>
        );
    }
    return (
        <main className="relative flex flex-col gap-3 min-h-[calc(100vh-4rem)] justify-center md:grid md:grid-cols-4 md:min-h-0">

            {/* desktop wardrobe */}
            <div className="hidden space-x-6 md:flex md:col-span-1">
                {/* category side menu */}
                <div className="w-32 bg-white z-50 flex flex-col gap-2">
                    {categories.map((item) => (
                        <button
                            key={item}
                            className=
                            {`rounded-lg px-4 py-2 text-left capitalize transition ${outfitCategory === item
                                ? "bg-blue-500 text-white"
                                : "text-slate-700 hover:bg-slate-100"
                                }
                            `}
                            onClick={() => setOutfitCategory(item)}
                        >
                            {item}
                        </button>
                    ))
                    }
                </div>

                {/* clothing items */}
                <div>
                    {items.length === 0 ? (
                        <div className="flex h-32 items-center justify-center text-sm text-gray-500">
                            No clothing in this category yet
                        </div>
                    ) : (
                        <div className="grid max-h-150 grid-cols-2 2xl:grid-cols-2 gap-3 overflow-y-auto">
                            {items &&
                                items.map((item) => (
                                    <button
                                        key={Number(item.id)}
                                        className="border border-gray-200 rounded-xl hover:border-2"
                                        onClick={() =>
                                            addClothingItem(
                                                {
                                                    id: Number(item.id),
                                                    itemName: item.item_name,
                                                    category: item.category,
                                                    image_path: item.imageUrl!,
                                                    stickerUrl: null
                                                })
                                        }
                                    >
                                        <img src={item.imageUrl!}
                                            alt={item.item_name}
                                            className="object-contain"
                                        />
                                    </button>
                                ))}
                        </div>
                    )}
                </div>

            </div>

            <div className="flex justify-center md:col-span-2 ">
                <div className="aspect-square w-full md:max-w-150">
                    <OutfitCanvas
                        items={canvasItems}
                        selectedId={selectedId}
                        onSelectItem={setSelectedId}
                        onChangeItems={setCanvasItems}
                        stageRef={stageRef}
                    />
                </div>
            </div>

            <aside className="flex space-y-3 justify-center flex-col md:w-fit md:col-span-1">

                <div className="flex w-full justify-center md:flex-col md:space-y-1">
                    <button
                        type="button"
                        disabled={!selectedId}
                        onClick={moveForwardOneLayer}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-200"
                    >
                        <RiBringForward size={24} />
                        <span className="hidden md:inline">
                            Bring Forward
                        </span>
                    </button>
                    <button
                        type="button"
                        disabled={!selectedId}
                        onClick={bringToFront}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-200"
                    >
                        <RiBringToFront size={24} />
                        <span className="hidden md:inline">
                            Bring to Front
                        </span>
                    </button>
                    <button
                        type="button"
                        disabled={!selectedId}
                        onClick={moveBackwardOneLayer}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-200"
                    >
                        <RiSendBackward size={24} />

                        <span className="hidden md:inline">
                            Send Backwards
                        </span>
                    </button>
                    <button
                        type="button"
                        disabled={!selectedId}
                        onClick={sendToBack}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-200"
                    >
                        <RiSendToBack size={24} />

                        <span className="hidden md:inline">
                            Send to back
                        </span>
                    </button>
                    <button
                        type="button"
                        disabled={!selectedId}
                        onClick={deleteSelectedItem}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-200"
                    >
                        <RiDeleteBin6Fill size={24} />
                        <span className="hidden md:inline">
                            Delete
                        </span>
                    </button>
                </div>

                    <button
                        type="button"
                        disabled={isSaving || canvasItems.length === 0}
                        onClick={saveOutfit}
                        className="flex justify-center rounded-xl items-center md:justify-start space-x-2 bg-blue-500 px-3 py-2 enabled:hover:bg-blue-900 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        <RiSave3Line />
                        <p>{isSaving ? "Saving..." : "Save outfit"} </p>
                    </button>

                    {saveError && (
                        <p className="text-center text-red-500 md:text-left">
                            {saveError}
                        </p>
                    )}

                    {saveSuccess && (
                        <p className="text-center text-green-600 md:text-left">
                            {saveSuccess}
                        </p>
                    )}

            </aside>


            {/* mobile wardrobe */}
            <div className="fixed bottom-10 left-0 right-0 z-40 flex gap-2 border-t px-2 md:hidden">

                {/* category selector */}
                <div className="relative shrink-0">

                    {isCategoryMenuOpen && (
                        <div className="absolute bottom-full left-0 mb-2 flex w-36  flex-col rounded-lg border bg-white shadow-lg">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setOutfitCategory(category);
                                        setIsCategoryMenuOpen(false);
                                    }}
                                    className="px-4 py-2 text-left capitalize hover:bg-slate-100"
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() =>
                            setIsCategoryMenuOpen((current) => !current)
                        }
                        className="rounded-lg bg-slate-100 px-3 py-2 h-20 w-32 capitalize"
                    >
                        {outfitCategory} ↑
                    </button>

                </div>

                {/* scrollable clothing area */}
                <div className="flex flex-1 gap-2 overflow-x-auto">

                    {items.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
                            No clothing in this category yet
                        </div>
                    ) : (
                        items.map((item) => (
                            <button
                                key={Number(item.id)}
                                className="h-20 w-20 shrink-0 border border-gray-400 rounded-xl overflow-hidden"
                                onClick={() =>
                                    addClothingItem({
                                        id: Number(item.id),
                                        itemName: item.item_name,
                                        category: item.category,
                                        image_path: item.imageUrl!,
                                        stickerUrl: null,
                                    })
                                }
                            >
                                <img
                                    src={item.imageUrl!}
                                    alt={item.item_name}
                                    className="h-full w-full object-contain"
                                />
                            </button>
                        ))
                    )}

                </div>

            </div>
        </main>
    );
}