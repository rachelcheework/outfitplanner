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
  selectedId: string | null;
  onSelectItem: (id: string | null) => void;
  onChangeItems: React.Dispatch<
    React.SetStateAction<CanvasItem[]>
  >;
  stageRef: RefObject<Konva.Stage | null>;
};

export default function OutfitCanvas({
  items,
  selectedId,
  onSelectItem,
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
      onSelectItem(null);
    }
  }

  return (
    <div
      ref={containerRef}
      className="aspect-square w-full"
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
              isSelected={item.id === selectedId}
              stageWidth={canvasSize}
              stageHeight={canvasSize}
              onSelect={() => onSelectItem(item.id)}
              onChange={updateItem}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}