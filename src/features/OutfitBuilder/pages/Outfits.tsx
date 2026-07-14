import { DragDropProvider } from "@dnd-kit/react";
import Droppable from "../components/Droppable";
import Draggable from "../components/Draggable";

import { useState } from "react";

export type ClothingPosition = {
  x: number;
  y: number
}

// type ClothingPositions = Record<string, ClothingPosition>;

const Outfits = () => {
  // const [isDropped, setIsDropped] = useState(false);
  const [position, setPosition] = useState<ClothingPosition>({
    x:0,
    y:0
  })

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        const {operation, canceled} = event;

        if(canceled) return;

        const { source, target, transform } = operation;

        if (
          source?.id === 'draggable' &&
          target?.id === 'droppable'
        ) {
          setPosition((previousPosition) => ({
            x: previousPosition.x + transform.x,
            y: previousPosition.y + transform.y
          }))
        }
        // setIsDropped(target?.id === 'droppable');
      }}
    >
      {/* {!isDropped && <Draggable />} */}

      <Droppable id="droppable">
        <Draggable id="draggable" position={position}/>
      </Droppable>
    </DragDropProvider>
  )
}

export default Outfits
