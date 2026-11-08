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

import CanvasButton from "../components/CanvasButton";
import { RiBringForward, RiBringToFront, RiSendToBack, RiSendBackward, RiDeleteBin6Fill, RiSave3Line } from "react-icons/ri";
import { FaRedoAlt } from "react-icons/fa";

export default function OutfitPage() {

    const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    function selectItem(id: string, multiSelect: boolean) {
        setSelectedIds((currentIds) => {
            // Shift/Ctrl/Cmd click
            if (multiSelect) {
                // Already selected → deselect it
                if (currentIds.includes(id)) {
                    return currentIds.filter(
                        (selectedId) => selectedId !== id
                    );
                }

                // Not selected → add it
                return [...currentIds, id];
            }

            // Normal click → select only this item
            return [id];
        });
    }

    const { user } = useAuth();

    const categories = clothingCategories;
    const [outfitCategory, setOutfitCategory] = useState<ClothingCategory>("tops");

    //for mobile category menu dropdown
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsCategoryMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    function resetCanvas() {
        setCanvasItems([]);
        setSelectedIds([]);
        setSaveSuccess(null);
        setSaveError(null);
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
            setSelectedIds([]);

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


    function addClothingItem(item: ClothingItem) {
        if (!item.image_path) {
            return;
        }

        const image = new window.Image();

        image.onload = () => {
            const stage = stageRef.current;

            if (!stage) {
                return;
            }
            const maxSize = 150;

            const scale = Math.min(
                maxSize / image.width,
                maxSize / image.height
            );

            const itemWidth = image.width * scale;
            const itemHeight = image.height * scale;

            const newCanvasItem: CanvasItem = {
                id: crypto.randomUUID(),
                imageUrl: item.image_path,
                x: stage.width() / 2 - itemWidth / 2,
                y: stage.height() / 2 - itemHeight / 2,
                width: itemWidth,
                height: itemHeight,
                rotation: 0,
            };

            setCanvasItems((currentItems) => [
                ...currentItems,
                newCanvasItem,
            ]);

            setSelectedIds([newCanvasItem.id]);
        };

        image.src = item.image_path;
    }

    function deleteSelectedItem() {
        if (selectedIds.length === 0) {
            return;
        }

        setCanvasItems((currentItems) =>
            currentItems.filter((item) => !selectedIds.includes(item.id)),
        );

        setSelectedIds([]);
    }

    function bringToFront() {
        if (selectedIds.length === 0) {
            return;
        }

        setCanvasItems((currentItems) => {
            const selectedItems = currentItems.filter((item) =>
                selectedIds.includes(item.id)
            );

            const unselectedItems = currentItems.filter(
                (item) => !selectedIds.includes(item.id)
            );

            return [
                ...unselectedItems,
                ...selectedItems,
            ];
        });
    }

    function sendToBack() {
        if (selectedIds.length === 0) {
            return;
        }

        setCanvasItems((currentItems) => {
            const selectedItems = currentItems.filter((item) =>
                selectedIds.includes(item.id)
            );

            const unselectedItems = currentItems.filter(
                (item) => !selectedIds.includes(item.id)
            );

            return [
                ...selectedItems,
                ...unselectedItems,
            ];
        });
    }

    function moveForwardOneLayer() {
        if (selectedIds.length !== 1) {
            return;
        }

        const selectedId = selectedIds[0];

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
        if (selectedIds.length !== 1) {
            return;
        }

        const selectedId = selectedIds[0];
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
    }, [selectedIds]);

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
        <main className="relative flex flex-1 flex-col gap-6 justify-center items-center xl:grid xl:grid-cols-4 xl:gap-2 xl:items-stretch
        ">

            {/* desktop wardrobe */}
            <div className="hidden min-h-0 xl:flex xl:gap-3 xl:col-span-1">
                {/* category side menu */}
                <div className="w-fit rounded-xl p-3 z-50 flex flex-col gap-2
                 bg-white/70 backdrop-blur-2xl shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
                    {categories.map((item) => (
                        <button
                            key={item}
                            className=
                            {`rounded-lg px-4 py-2 text-left capitalize transition ${outfitCategory === item
                                ? "bg-blue-500/80 text-white ring-1 ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                                : "text-gray-800 hover:bg-gray-200/70"
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
                <div className="flex">
                    {items.length === 0 ? (
                        <div className="p-3 justify-center text-sm">
                            No clothing in this category yet
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2 content-start items-start overflow-y-auto xl:p-1 xl:grid-cols-2 2xl:grid-cols-3">
                            {items &&
                                items.map((item) => (
                                    <button
                                        key={Number(item.id)}
                                        className="min-h-32 cursor-pointer
                                         hover:drop-shadow-sm hover:drop-shadow-gray-50 hover:scale-105
                                        rounded-xl
                                        bg-white/70 backdrop-blur-xl
                                        shadow-[0_2px_4px_rgba(0,0,0,0.08)]
                                        focus-visible:outline-none
                                        "
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

            <div className="flex min-w-0 w-full justify-center xl:col-span-2 xl:items-center">
                <div className="flex min-w-0 w-full justify-center">
                    <OutfitCanvas
                        items={canvasItems}
                        selectedIds={selectedIds}
                        onSelectItem={selectItem}
                        onClearSelection={() => setSelectedIds([])}
                        onChangeItems={setCanvasItems}
                        stageRef={stageRef}
                    />
                </div>
            </div>

            <aside className="flex space-y-3 justify-center max-w-md flex-col xl:w-fit xl:col-span-1 xl:items-stretch">
                <div className="flex w-full justify-center text-gray-800 xl:flex-col xl:space-y-1">
                    <CanvasButton
                        label="Reset"
                        btnFunc={resetCanvas}
                        btnDisabled={canvasItems.length === 0}
                        icon={<FaRedoAlt size={16} />}
                    />
                    <CanvasButton
                        label="Bring Forward"
                        btnFunc={moveForwardOneLayer}
                        btnDisabled={canvasItems.length === 0}
                        icon={<RiBringForward size={24} />}
                    />
                    <CanvasButton
                        label="Bring to Front"
                        btnFunc={bringToFront}
                        btnDisabled={canvasItems.length === 0}
                        icon={<RiBringToFront size={24} />}
                    />
                    <CanvasButton
                        label="Send Backwards"
                        btnFunc={moveBackwardOneLayer}
                        btnDisabled={canvasItems.length === 0}
                        icon={<RiSendBackward size={24} />}
                    />
                    <CanvasButton
                        label="Send to back"
                        btnFunc={sendToBack}
                        btnDisabled={canvasItems.length === 0}
                        icon={<RiSendToBack size={24} />}
                    />
                    <CanvasButton
                        label="Delete"
                        btnFunc={deleteSelectedItem}
                        btnDisabled={canvasItems.length === 0}
                        icon={<RiDeleteBin6Fill size={24} />}
                    />
                </div>

                <button
                    type="button"
                    disabled={isSaving || canvasItems.length === 0}
                    onClick={saveOutfit}
                    className="flex justify-center rounded-lg items-center xl:justify-start space-x-2 px-3 py-2
                    bg-blue-500/80 text-white ring-1 ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]
                     enabled:hover:bg-blue-500 
                     disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                    <RiSave3Line />
                    <p>{isSaving ? "Saving..." : "Save outfit"} </p>
                </button>

                <div className="h-24 md:h-0">

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
                </div>

            </aside>


            {/* mobile wardrobe */}
            <div className="fixed bottom-20 left-6 right-6 z-40 flex gap-2 py-2 pr-2 
                md:static md:w-full md:max-w-2xl
                md:mx-auto md:px-4
                xl:hidden">

                {/* category selector */}
                <div ref={dropdownRef} className="relative shrink-0">

                    {isCategoryMenuOpen && (
                        <div className="absolute bottom-full left-2 mb-2 p-1 flex w-36 flex-col space-y-1 rounded-lg bg-white ring-1 ring-black/5 shadow-lg">
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
                        className="rounded-lg bg-white text-gray-800 pr-3 h-20 w-32 capitalize"
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
                                className="aspect-square h-20 shrink-0 border border-black/10 bg-white rounded-xl overflow-hidden focus:outline-none"
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