import { useDraggable } from '@dnd-kit/react';
// import type { ReactNode } from 'react';

//draggable object

export type ClothingPosition = {
  x: number;
  y: number;
};

type DraggableProps = {
  id: string;
  // children: ReactNode;
  position: ClothingPosition
}

const Draggable = ({
  id,
  // children,
  position }: DraggableProps) => {
  const { ref } = useDraggable({
    id,
  });

  return (
    <button
      ref={ref}
      className='absolute cursor-grab touch-none bg-amber-600'
      style={{
        left: position.x,
        top: position.y
      }}
    >
      {/* {children} */}
      Draggable Item
    </button>
  );
}

export default Draggable;