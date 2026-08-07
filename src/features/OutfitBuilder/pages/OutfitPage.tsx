import { useState, useEffect, useRef } from "react";
import type Konva from "konva";
import supabase from "../../../supabase-client";
import type { ClothingItem } from "../../WardrobeDisplay/components/WardrobeCard";
import OutfitCanvas from "../components/OutfitCanvas";
import type { CanvasItem } from "../types/CanvasItem";

import { clothingCategories, type ClothingCategory } from "../../../constants/Categories";
import { useQuery } from "@tanstack/react-query";
import fetchClothesByCategory from "../../../api/clothes";

export default function OutfitPage() {

    const categories = clothingCategories;
    const [outfitCategory, setOutfitCategory] = useState<ClothingCategory>("tops");

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
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError) {
                throw userError;
            }

            if (!user) {
                throw new Error("You must be logged in to save an outfit.");
            }

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
            const outfitImagePath = `${user.id}/${fileName}`;

            /*
             * First, upload the actual PNG to Storage.
             */
            const { error: uploadError } = await supabase.storage
                .from("outfits-collection")
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
                .from("outfits_table")
                .insert({
                    user_id: user.id,
                    outfit_image_path: outfitImagePath,
                });

            if (insertError) {
                /*
                 * The image was uploaded, but the row failed.
                 * Remove the uploaded image to avoid an orphaned file.
                 */
                await supabase.storage
                    .from("outfits")
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
        queryKey: ["clothes", outfitCategory],
        queryFn: () => fetchClothesByCategory(outfitCategory!),
        enabled: Boolean(outfitCategory) //query is only enabled if outfitCategory exists
    });

    const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    function addClothingItem(item: ClothingItem) {
        if (!item.image_path) {
            return;
        }

        const newCanvasItem: CanvasItem = {
            id: crypto.randomUUID(),
            imageUrl: item.image_path,
            x: 300,
            y: 400,
            width: 150,
            height: 150,
            rotation: 0,
        };

        setCanvasItems((currentItems) => [
            ...currentItems,
            newCanvasItem,
        ]);

        setSelectedId(newCanvasItem.id);
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

    //for some reason isLoading and isError must be placed at the bottom because of a render hooks issue
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
        <main className="flex justify-center gap-6">

            {/* wardrobe catelogue */}
            <div className="flex space-x-2">
                <div className="flex flex-col space-y-2">
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

                {items && (
                    <div>
                        {items.map((item) => (
                            <button
                                key={Number(item.id)}
                                className="w-24"
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
                                <img src={item.imageUrl!} />
                            </button>
                        ))}
                    </div>
                )}

            </div>

            <OutfitCanvas
                items={canvasItems}
                selectedId={selectedId}
                width={700}
                height={600}
                onSelectItem={setSelectedId}
                onChangeItems={setCanvasItems}
                stageRef={stageRef}
            />
            <aside className="w-1/4 flex flex-col justify-center gap-2">
                {/* <button
                    type="button"
                    onClick={() =>
                        addClothingItem(
                            {
                                id: 1,
                                itemName: "White shirt",
                                category: "tops",
                                image_path: "/images/test.jpg",
                                stickerUrl: null
                            })
                    }
                >
                    Add clothing item
                </button> */}

                <button
                    type="button"
                    disabled={!selectedId}
                    onClick={bringToFront}
                >
                    Bring to front
                </button>

                <button
                    type="button"
                    disabled={!selectedId}
                    onClick={moveForwardOneLayer}
                >
                    Move Forward
                </button>
                <button
                    type="button"
                    disabled={!selectedId}
                    onClick={moveBackwardOneLayer}
                >
                    Move Backward
                </button>
                <button
                    type="button"
                    disabled={!selectedId}
                    onClick={sendToBack}
                >
                    Send to back
                </button>

                <button
                    type="button"
                    disabled={!selectedId}
                    onClick={deleteSelectedItem}
                >
                    Delete
                </button>

                <button
                    type="button"
                    disabled={isSaving || canvasItems.length === 0}
                    onClick={saveOutfit}
                    className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Save outfit"}
                </button>

                {saveError && (
                    <p className="text-red-500">
                        {saveError}
                    </p>
                )}

                {saveSuccess && (
                    <p className="text-green-600">
                        {saveSuccess}
                    </p>
                )}
            </aside>
        </main>
    );
}