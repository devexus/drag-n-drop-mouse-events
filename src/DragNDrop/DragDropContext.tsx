import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import useUniqueContextId from "./use-unique-context-id";

interface IDragDropCtx {
  ref: React.RefObject<HTMLElement> | null;
  contextId: string | null;
  onDragEnd?: (droppableId: string, dragglabeId: string) => void;
  setDroppableId: React.Dispatch<React.SetStateAction<string | null>> | null;
  droppableId: string | null;
}

const DragDropCtx = createContext<IDragDropCtx>({
  ref: null,
  contextId: null,
  setDroppableId: null,
  droppableId: null,
});

interface IDragDropContext {
  children: ReactNode;
  onDragEnd?: (droppableId: string, dragglabeId: string) => void;
}

const DragDropContext: FC<IDragDropContext> = ({ children, onDragEnd }) => {
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
