import type { ReactNode } from "react";
import {useDroppable  } from '@dnd-kit/react';

//area to drop objects into

type DroppableProps = {
    id: string;
    children: ReactNode;
  };
  

const Droppable = ({id, children}:DroppableProps) => {
  const {ref} = useDroppable({
    id,
  });

  return (
    <div ref={ref} className="relative w-120 h-48 overflow-hidden border border-red-400 rounded-xl">
      {children}
    </div>
  );
}

export default Droppable;