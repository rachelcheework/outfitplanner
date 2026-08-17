import {
  useRef,
  useState,
  useEffect,
  type RefObject,
} from "react";

import { Layer, Rect, Stage } from "react-konva";
import type Konva from "konva";

import CanvasClothingItem from "./CanvasClothingItem";
import type { CanvasItem } from "../types/CanvasItem";

type OutfitCanvasProps = {
  items: CanvasItem[];
  selectedIds: string[];
  onSelectItem: (
    id: string,
    multiSelect: boolean
  ) => void;
  onClearSelection: () => void;
  onChangeItems: React.Dispatch<
    React.SetStateAction<CanvasItem[]>
  >;
  stageRef: RefObject<Konva.Stage | null>;
};

export default function OutfitCanvas({
  items,
  selectedIds,
  onSelectItem,
  onClearSelection,
  onChangeItems,
  stageRef,
}: OutfitCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(0);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      setCanvasSize(container.clientWidth);
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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

    if (
      event.target === stage ||
      event.target.name() === "canvas-background"
    ) {
      onClearSelection();
    }
  }

  function moveSelectedItems(
    deltaX: number,
    deltaY: number
  ) {
    onChangeItems((currentItems) =>
      currentItems.map((item) =>
        selectedIds.includes(item.id)
          ? {
              ...item,
              x: item.x + deltaX,
              y: item.y + deltaY,
            }
          : item
      )
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
    >
      <Stage
        ref={stageRef}
        width={canvasSize}
        height={canvasSize}
        onMouseDown={handleStagePointerDown}
        onTouchStart={handleStagePointerDown}
        className="overflow-hidden rounded-xl border border-gray-300"
      >
        <Layer>
          <Rect
            name="canvas-background"
            width={canvasSize}
            height={canvasSize}
            fill="white"
          />

          {items.map((item) => (
            <CanvasClothingItem
              key={item.id}
              item={item}
              isSelected={selectedIds.includes(item.id)}
              stageWidth={canvasSize}
              stageHeight={canvasSize}
              onSelect={(multiSelect) =>
                onSelectItem(item.id, multiSelect)
              }
              onChange={updateItem}
              onMoveSelectedItems={moveSelectedItems}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}