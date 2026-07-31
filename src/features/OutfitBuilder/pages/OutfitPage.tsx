import { useState, useEffect } from "react";
import type { ClothingItem } from "../../WardrobeDisplay/components/WardrobeCard";
import OutfitCanvas from "../components/OutfitCanvas";
import type { CanvasItem } from "../types/CanvasItem";

import { clothingCategories, type ClothingCategory } from "../../../constants/Categories";
import { useQuery } from "@tanstack/react-query";
import fetchClothesByCategory from "../../../api/clothes";

export default function OutfitPage() {

    const categories = clothingCategories;
    const [outfitCategory, setOutfitCategory] = useState<ClothingCategory>("tops");

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
            x: 250,
            y: 200,
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
                            {`rounded-lg px-4 py-2 text-left capitalize transition text-slate-700
                 hover:bg-slate-100 focus:bg-blue-500 focus:text-white
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
                                <img src={item.imageUrl!}/>
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
            />
            <aside className="w-1/4 bg-red-400 flex flex-col justify-center gap-2">
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
            </aside>
        </main>
    );
}