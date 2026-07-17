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
  onSelect: () => void;
  onChange: (updatedItem: CanvasItem) => void;
};

export default function CanvasClothingItem({
  item,
  isSelected,
  stageWidth,
  stageHeight,
  onSelect,
  onChange,
}: CanvasClothingItemProps) {
  const [image] = useImage(item.imageUrl, "anonymous");

  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

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
        onClick={onSelect}
        onTap={onSelect}
        onDragStart={onSelect}
        dragBoundFunc={(position) => {
          return {
            x: Math.max(
              0,
              Math.min(position.x, stageWidth - item.width),
            ),
            y: Math.max(
              0,
              Math.min(position.y, stageHeight - item.height),
            ),
          };
        }}
        onDragEnd={(event) => {
          onChange({
            ...item,
            x: event.target.x(),
            y: event.target.y(),
          });
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
          flipEnabled={false}
          keepRatio
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