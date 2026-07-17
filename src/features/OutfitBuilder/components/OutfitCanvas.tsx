import { Layer, Rect, Stage } from "react-konva";
import type Konva from "konva";

import CanvasClothingItem from "./CanvasClothingItem";
import type { CanvasItem } from "../types/CanvasItem";

type OutfitCanvasProps = {
  items: CanvasItem[];
  selectedId: string | null;
  width: number;
  height: number;
  onSelectItem: (id: string | null) => void;
  onChangeItems: (items: CanvasItem[]) => void;
};

export default function OutfitCanvas({
  items,
  selectedId,
  width,
  height,
  onSelectItem,
  onChangeItems,
}: OutfitCanvasProps) {
  function updateItem(updatedItem: CanvasItem) {
    onChangeItems(
      items.map((item) =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    );
  }

  function handleStagePointerDown(
    event: Konva.KonvaEventObject<MouseEvent | TouchEvent>,
  ) {
    const stage = event.target.getStage();

    /*
     * If the Stage itself or its background was clicked,
     * deselect the current clothing item.
     */
    if (
      event.target === stage ||
      event.target.name() === "canvas-background"
    ) {
      onSelectItem(null);
    }
  }

  return (
    <Stage
      width={width}
      height={height}
      onMouseDown={handleStagePointerDown}
      onTouchStart={handleStagePointerDown}
      className="overflow-hidden rounded-xl border border-gray-300"
    >
      <Layer>
        <Rect
          name="canvas-background"
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#ffffff"
        />

        {items.map((item) => (
          <CanvasClothingItem
            key={item.id}
            item={item}
            isSelected={item.id === selectedId}
            stageWidth={width}
            stageHeight={height}
            onSelect={() => onSelectItem(item.id)}
            onChange={updateItem}
          />
        ))}
      </Layer>
    </Stage>
  );
}