import { useEffect, useRef } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";
import type Konva from "konva";

import type { CanvasItem } from "../types/CanvasItem";

type CanvasClothingItemProps = {
  item: CanvasItem;
  isSelected: boolean;
  stageWidth: number;
  stageHeight: number;
  onSelect: (multiSelect: boolean) => void;
  onChange: (updatedItem: CanvasItem) => void;
  onMoveSelectedItems: (
    deltaX: number,
    deltaY: number
  ) => void;
};

export default function CanvasClothingItem({
  item,
  isSelected,
  stageWidth,
  stageHeight,
  onSelect,
  onChange,
  onMoveSelectedItems
}: CanvasClothingItemProps) {
  const [image] = useImage(item.imageUrl, "anonymous");

  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isSelected) {
      return;
    }

    const imageNode = imageRef.current;
    const transformerNode = transformerRef.current;

    if (!imageNode || !transformerNode) {
      return;
    }

    transformerNode.nodes([imageNode]);
    transformerNode.getLayer()?.batchDraw();
  }, [isSelected]);

  return (
    <>
      <Image
        ref={imageRef}
        image={image}
        x={item.x}
        y={item.y}
        width={item.width}
        height={item.height}
        rotation={item.rotation}
        draggable
        onClick={(event) => {
          const multiSelect =
            event.evt.shiftKey ||
            event.evt.ctrlKey ||
            event.evt.metaKey;

          onSelect(multiSelect);
        }}
        onTap={() => {
          onSelect(false);
        }}

        onDragStart={(event) => {
          // const multiSelect =
          //   event.evt.shiftKey ||
          //   event.evt.ctrlKey ||
          //   event.evt.metaKey;

          // onSelect(multiSelect);
          if (!isSelected) {
            onSelect(false);
          }

          dragStartRef.current = {
            x: event.target.x(),
            y: event.target.y(),
          };
        }}
        onDragMove={(event) => {
          if (!dragStartRef.current) {
            return;
          }

          const deltaX =
            event.target.x() - dragStartRef.current.x;

          const deltaY =
            event.target.y() - dragStartRef.current.y;

          onMoveSelectedItems(deltaX, deltaY);

          dragStartRef.current = {
            x: event.target.x(),
            y: event.target.y(),
          };
        }}
        onDragEnd={() => {
          dragStartRef.current = null;
        }}


        onTransformEnd={() => {
          const imageNode = imageRef.current;

          if (!imageNode) {
            return;
          }

          const scaleX = imageNode.scaleX();
          const scaleY = imageNode.scaleY();

          /*
           * Konva Transformer changes scaleX and scaleY during resizing.
           * Convert those scales into permanent width and height values.
           */
          imageNode.scaleX(1);
          imageNode.scaleY(1);

          onChange({
            ...item,
            x: imageNode.x(),
            y: imageNode.y(),
            width: Math.max(30, imageNode.width() * scaleX),
            height: Math.max(30, imageNode.height() * scaleY),
            rotation: imageNode.rotation(),
          });
        }}
      />

      {isSelected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled
          resizeEnabled
          flipEnabled={true}
          keepRatio={true}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            const minimumSize = 30;

            if (
              Math.abs(newBox.width) < minimumSize ||
              Math.abs(newBox.height) < minimumSize
            ) {
              return oldBox;
            }

            return newBox;
          }}
        />
      )}
    </>
  );
}