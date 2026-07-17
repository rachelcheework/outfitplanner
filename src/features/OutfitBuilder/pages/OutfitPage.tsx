import { useState, useEffect } from "react";
import type { ClothingItem } from "../../WardrobeDisplay/components/WardrobeCard";
import OutfitCanvas from "../components/OutfitCanvas";
import type { CanvasItem } from "../types/CanvasItem";

export default function OutfitPage() {
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

    return (
        <main className="flex gap-6">
            <aside className="w-64">
                <button
                    type="button"
                    onClick={() =>
                        addClothingItem(
                            {
                                id: 1,
                                itemName: "White shirt",
                                category: "tops",
                                image_path: "/images/test.jpg",
                                stickerUrl: null
                            }                        )
                    }
                >
                    Add clothing item
                </button>
            </aside>

            <div className="flex gap-2">
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
            </div>

                <OutfitCanvas
                    items={canvasItems}
                    selectedId={selectedId}
                    width={700}
                    height={600}
                    onSelectItem={setSelectedId}
                    onChangeItems={setCanvasItems}
                />
        </main>
    );
}