import { ReactElement, ReactNode, RefObject } from "react";

export interface IDraggableProps {
  draggableId: string;
  renderClone: ReactElement;
  children(
    isDragging: boolean,
    innerRef: RefObject<HTMLDivElement>
  ): ReactElement<HTMLElement>;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IDroppableDataTags {
  "data-droppable-context-id": string;
  "data-droppable-id": string;
}

export interface IDroppableProps {
  droppableId: string;
  children(
    isOver: boolean,
    innerRef: React.RefObject<HTMLDivElement>,
    droppableProps: IDroppableDataTags
  ): React.ReactElement<HTMLElement>;
}

export interface IDragDropProviderProps {
  children: ReactNode;
  onDragEnd?: (droppableId: string, dragglabeId: string) => void;
}

export interface IDragDropContextProps {
  ref: React.RefObject<HTMLElement> | null;
  contextId: string | null;
  onDragEnd?: (droppableId: string, dragglabeId: string) => void;
  setDroppableId: React.Dispatch<React.SetStateAction<string | null>> | null;
  droppableId: string | null;
}
