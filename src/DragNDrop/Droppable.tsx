import { FC, useRef } from "react";
import { useDragDrop } from "./DragDropContext";

interface DroppableProps {
  "data-droppable-context-id": string;
  "data-droppable-id": string;
}

const Droppable: FC<{
  droppableId: string;
  children(
    isOver: boolean,
    innerRef: React.RefObject<HTMLDivElement>,
    droppableProps: DroppableProps
  ): React.ReactElement<HTMLElement>;
}> = ({ children, droppableId }) => {
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
