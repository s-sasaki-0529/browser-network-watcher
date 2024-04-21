import { useEffect } from "react";

export const useDraggable = (elRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    const el = elRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      offsetX = e.clientX - el.getBoundingClientRect().left;
      offsetY = e.clientY - el.getBoundingClientRect().top;
      el.style.cursor = "move";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        el.style.left = e.clientX - offsetX + "px";
        el.style.top = e.clientY - offsetY + "px";
        el.style.right = "auto";
        el.style.bottom = "auto";
      }
    };
    const onMouseUp = () => {
      isDragging = false;
      el.style.cursor = "default";
    };

    el.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  });
};
