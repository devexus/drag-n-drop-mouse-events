import { FC, useRef } from "react";
import { useDragDrop } from "./DragDropContext";
import { IDroppableProps } from "./types";

const Droppable: FC<IDroppableProps> = ({ children, droppableId }) => {
  const { contextId, droppableId: droppableIdFromContext } = useDragDrop();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      {children(droppableId === droppableIdFromContext, ref, {
        "data-droppable-context-id": contextId!,
        "data-droppable-id": droppableId,
      })}
    </>
  );
};

export default Droppable;
