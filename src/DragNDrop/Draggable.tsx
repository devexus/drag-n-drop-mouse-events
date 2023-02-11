import { cloneElement, FC, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDragDrop } from "./DragDropContext";
import getElementWithAttribute from "./getElementWithAttribute";
import { IDraggableProps, IPoint } from "./types";

const Draggable: FC<IDraggableProps> = ({
  renderClone,
  children,
  draggableId,
}) => {
  const { contextId, setDroppableId, droppableId, onDragEnd } = useDragDrop();
  const ref = useRef<HTMLDivElement | null>(null);
  const bound = useRef<DOMRect>();
  const lerpedElementPosition = useRef<IPoint>({ x: 0, y: 0 });
  const ended = useRef(false);
  const cords = useRef<IPoint>({ x: 0, y: 0 });
  const initMousePos = useRef<IPoint>();
  const draggableElementRef = useRef<HTMLElement | null>(null);
  const droppabledIdRef = useRef<string | null>(null);
  const isDraggingRef = useRef(false);

  const [isDraggingCurrent, setIsDraggingCurrent] = useState(false);
  const clonedElement = cloneElement(renderClone, { ref: draggableElementRef });

  const handleOnMouseDown = (event: MouseEvent) => {
    if (event.button !== 0) return;

    bound.current = ref.current?.getBoundingClientRect();

    const xCord = event.x - bound.current!.x;
    const yCord = event.y - bound.current!.y;

    initMousePos.current = { x: xCord, y: yCord };

    ended.current = false;
    cords.current = { x: 0, y: 0 };
    lerpedElementPosition.current = { x: 0, y: 0 };

    document.addEventListener("dragstart", onDragStart);
    document.body.addEventListener("mousemove", handleOnMouseMove);
    document.body.addEventListener("mouseup", handleOnMouseUp);
    document.addEventListener("mouseup", handleOnMouseUp);
  };

  const onDragStart = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleOnMouseUp = (event: MouseEvent) => {
    document.body.removeEventListener("mousemove", handleOnMouseMove);
    document.body.removeEventListener("mouseup", handleOnMouseUp);
    document.removeEventListener("mouseup", handleOnMouseUp);
    document.removeEventListener("dragstart", onDragStart);
    document.body.style.setProperty("cursor", "default");
    setIsDraggingCurrent(false);

    ended.current = false;
    cords.current = { x: 0, y: 0 };
    lerpedElementPosition.current = { x: 0, y: 0 };

    if (droppabledIdRef.current != null && onDragEnd && isDraggingRef.current) {
      onDragEnd(droppabledIdRef.current, draggableId);
    }
    if (setDroppableId) setDroppableId(null);
  };

  const handleOnMouseMove = (event: MouseEvent) => {
    const xCord = event.x - bound.current!.x;
    const yCord = event.y - bound.current!.y;

    if (xCord === initMousePos.current!.x && yCord === initMousePos.current!.y)
      return;

    setIsDraggingCurrent(true);

    cords.current.x = xCord;
    cords.current.y = yCord;

    if (draggableElementRef.current == null) return;

    const draggableEl = draggableElementRef.current;
    draggableEl.style.setProperty("display", "none");

    const elemBelow = document.elementFromPoint(
      event.clientX,
      event.clientY
    ) as HTMLElement;

    const el = elemBelow
      ? getElementWithAttribute(elemBelow, "data-droppable-context-id")
      : null;

    if (
      el != null &&
      el.getAttribute("data-droppable-context-id") === contextId &&
      setDroppableId != null
    ) {
      setDroppableId(el.getAttribute("data-droppable-id"));
    } else if (setDroppableId != null) {
      setDroppableId(null);
    }

    draggableEl.style.setProperty("display", null);

    if (ended.current)
      draggableEl.style.setProperty(
        "transform",
        `translate(${xCord}px, ${yCord}px)`
      );
  };

  useEffect(() => {
    if (!isDraggingCurrent) return;

    const draggableEl = draggableElementRef.current!;
    const b = bound.current!;

    let timeoutRef: number;

    document.body.style.setProperty("cursor", "grabbing");
    draggableEl.style.setProperty("position", "fixed");
    draggableEl.style.setProperty("z-index", "5000");
    draggableEl.style.setProperty("width", `${b.width}px`);
    draggableEl.style.setProperty("left", `${b.left}px`);
    draggableEl.style.setProperty("top", `${b.top}px`);

    const initialLerpedTransition = (duration: number) => {
      let startTime = Date.now();
      let currentTime;
      let progress;

      const transitionStep = () => {
        currentTime = Date.now() - startTime;
        progress = currentTime / duration;
        lerpedElementPosition.current.x =
          (1 - progress) * lerpedElementPosition.current.x +
          progress * cords.current.x;
        lerpedElementPosition.current.y =
          (1 - progress) * lerpedElementPosition.current.y +
          progress * cords.current.y;

        if (progress < 1) {
          draggableEl.style.setProperty(
            "transform",
            `translate(${lerpedElementPosition.current.x}px, ${lerpedElementPosition.current.y}px)`
          );

          timeoutRef = setTimeout(transitionStep, 10);
        } else {
          ended.current = true;
        }
      };

      transitionStep();
    };
    initialLerpedTransition(500);

    return () => {
      if (timeoutRef) clearTimeout(timeoutRef);
    };
  }, [isDraggingCurrent]);

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
