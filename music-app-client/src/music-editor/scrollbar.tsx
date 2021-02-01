import React, { memo, useEffect } from "react";
import { useToggle } from "../hooks/use-toggle";
import { Point } from "./note-matrix/note-matrix";

export const ScrollBar = memo<{
  width: number;
  height: number;
  translate: Point;
  updatePosition: (point: Point) => void;
}>(({ width, height, translate, updatePosition }) => {
  const [isSelected, toggleSelected] = useToggle(false);

  useEffect(() => {
    const handleMouseUp = () => isSelected && toggleSelected();
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [isSelected, toggleSelected]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) =>
      isSelected && updatePosition({ x: -event.movementX, y: 0 });
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isSelected, updatePosition]);

  return (
    <rect
      onMouseDown={toggleSelected}
      transform={`translate(${translate.x},${translate.y})`}
      height={height}
      width={width}
      fill={isSelected ? "lightgrey" : "grey"}
    />
  );
});
