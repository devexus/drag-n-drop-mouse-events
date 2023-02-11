import { cloneElement, ReactElement, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDragDrop } from "./DragDropContext";

const Draggable = ({
  renderClone,
  children,
  draggableId,
}: {
  draggableId: string;
  renderClone: ReactElement;
  children(
    isDragging: boolean,
    innerRef: React.RefObject<HTMLDivElement>
  ): React.ReactElement<HTMLElement>;
}) => {
  const { contextId, setDroppableId, droppableId, onDragEnd } = useDragDrop();
  const ref = useRef<HTMLDivElement | null>(null);
  const bound = useRef<DOMRect>();
  const currentValueRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const ended = useRef(false);
  const runOnce = useRef(false);
  const cords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initMousePos = useRef<{ x: number; y: number }>();
  const [isDraggingCurrent, setIsDraggingCurrent] = useState(false);
  const draggableElementRef = useRef<HTMLElement | null>(null);
  const clonedElement = cloneElement(renderClone, { ref: draggableElementRef });
  const droppabledIdRef = useRef<string | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const handleOnMouseDown = (event: MouseEvent) => {
    if (event.button !== 0) return;

    bound.current = ref.current?.getBoundingClientRect();

    const xCord = event.x - bound.current!.x;
    const yCord = event.y - bound.current!.y;

    initMousePos.current = { x: xCord, y: yCord };

    ended.current = false;
    runOnce.current = false;
    cords.current = { x: 0, y: 0 };
    currentValueRef.current = { x: 0, y: 0 };

    document.body.addEventListener("mousemove", handleOnMouseMove);
    document.body.addEventListener("mouseup", handleOnMouseUp);
    document.addEventListener("mouseup", handleOnMouseUp);
  };

  useEffect(() => {
    if (
      !isDraggingCurrent ||
      draggableElementRef?.current == null ||
      bound.current == null
    )
      return;

    if (draggableElementRef.current) draggableElementRef.current.hidden = true;

    let timeoutRef: number;

    document.body.style.setProperty("cursor", "grabbing");
    draggableElementRef.current.style.setProperty("position", "fixed");
    draggableElementRef.current.style.setProperty("z-index", "5000");
    draggableElementRef.current.style.setProperty(
      "width",
      `${bound.current.width}px`
    );
    draggableElementRef.current.style.setProperty("height", `50px`);
    draggableElementRef.current.style.setProperty(
      "left",
      `${bound.current.left}px`
    );
    draggableElementRef.current.style.setProperty(
      "top",
      `${bound.current.top}px`
    );

    function initialLerpedTransition(duration: number) {
      let startTime = Date.now();
      let currentTime;
      let progress;

      function transitionStep() {
        currentTime = Date.now() - startTime;
        progress = currentTime / duration;
        currentValueRef.current.x =
          (1 - progress) * currentValueRef.current.x +
          progress * cords.current.x;
        currentValueRef.current.y =
          (1 - progress) * currentValueRef.current.y +
          progress * cords.current.y;

        if (progress < 1) {
          draggableElementRef?.current?.style.setProperty(
            "transform",
            `translate(${currentValueRef.current.x}px, ${currentValueRef.current.y}px)`
          );

          timeoutRef = setTimeout(transitionStep, 10);
        } else {
          ended.current = true;
        }
      }

      transitionStep();
    }
    if (!runOnce.current) initialLerpedTransition(500);

    return () => {
      if (timeoutRef) clearTimeout(timeoutRef);
    };
  }, [isDraggingCurrent]);

  const handleOnMouseUp = (event: MouseEvent) => {
    document.body.removeEventListener("mousemove", handleOnMouseMove);
    document.body.removeEventListener("mouseup", handleOnMouseUp);
    document.removeEventListener("mouseup", handleOnMouseUp);
    document.body.style.setProperty("cursor", "default");
    ref.current?.style.setProperty("pointer-events", null);
    setIsDraggingCurrent(false);

    ended.current = false;
    runOnce.current = false;
    cords.current = { x: 0, y: 0 };
    currentValueRef.current = { x: 0, y: 0 };

    if (droppabledIdRef.current != null && onDragEnd && isDraggingRef.current) {
      onDragEnd(droppabledIdRef.current, draggableId);
    }
    if (setDroppableId) setDroppableId(null);
  };

  const handleOnMouseMove = (event: MouseEvent) => {
    const e = event;
    if (bound.current == null) return;

    const xCord = e.x - bound.current!.x;
    const yCord = e.y - bound.current!.y;

    if (
      xCord === initMousePos?.current?.x &&
      yCord === initMousePos.current.y
    ) {
      return;
    }

    ref.current?.style.setProperty("pointer-events", "none");

    setIsDraggingCurrent(true);

    cords.current.x = xCord;
    cords.current.y = yCord;

    if (draggableElementRef?.current == null) return;

    draggableElementRef.current.style.setProperty("display", "none");
    const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    const droppableElement = elemBelow?.hasAttribute(
      "data-droppable-context-id"
    );

    if (
      droppableElement != null &&
      elemBelow?.getAttribute("data-droppable-context-id") === contextId &&
      setDroppableId != null
    ) {
      setDroppableId(elemBelow?.getAttribute("data-droppable-id"));
    } else if (setDroppableId != null) {
      setDroppableId(null);
    }

    draggableElementRef.current.style.setProperty("display", null);

    if (ended.current) {
      draggableElementRef?.current?.style.setProperty(
        "transform",
        `translate(${xCord}px, ${yCord}px)`
      );
    }
  };

  useEffect(() => {
    ref.current?.addEventListener("mousedown", handleOnMouseDown);

    return () => {
      ref.current?.removeEventListener("mousedown", handleOnMouseDown);
      document.body.removeEventListener("mousemove", handleOnMouseMove);
      document.body.removeEventListener("mouseup", handleOnMouseUp);
      document.removeEventListener("mouseup", handleOnMouseUp);
    };
  }, []);

  useEffect(() => {
    droppabledIdRef.current = droppableId;
  }, [droppableId]);

  useEffect(() => {
    isDraggingRef.current = isDraggingCurrent;
  }, [isDraggingCurrent]);

  return (
    <>
      {isDraggingCurrent
        ? createPortal(clonedElement, document.getElementById("root")!)
        : null}
      {children(isDraggingCurrent, ref)}
    </>
  );
};

export default Draggable;
