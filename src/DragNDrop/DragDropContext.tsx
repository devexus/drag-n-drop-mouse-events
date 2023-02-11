import { createContext, FC, useContext, useRef, useState } from "react";
import { IDragDropContextProps, IDragDropProviderProps } from "./types";
import useUniqueContextId from "./useUniqueContextId";

const DragDropCtx = createContext<IDragDropContextProps>({
  ref: null,
  contextId: null,
  setDroppableId: null,
  droppableId: null,
});

const DragDropContext: FC<IDragDropProviderProps> = ({
  children,
  onDragEnd,
}) => {
  const ref = useRef<HTMLElement>(null);
  const contextId: string = useUniqueContextId();
  const [droppableId, setDroppableId] = useState<string | null>(null);

  return (
    <DragDropCtx.Provider
      value={{
        ref,
        onDragEnd,
        contextId,
        droppableId,
        setDroppableId,
      }}
    >
      {children}
    </DragDropCtx.Provider>
  );
};

const useDragDrop = () => {
  const context = useContext(DragDropCtx);

  if (context === undefined) {
    throw new Error("useDragDrop must be used within a DragDropContext");
  }

  return {
    ref: context.ref,
    onDragEnd: context.onDragEnd,
    contextId: context.contextId,
    setDroppableId: context.setDroppableId,
    droppableId: context.droppableId,
  };
};

export { DragDropContext, useDragDrop };
