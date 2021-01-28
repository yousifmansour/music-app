import classNames from "classnames";
import React, {
  memo,
  SVGAttributes,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useMultipleToggles, useToggle } from "../../hooks/use-toggle";
import "./note-matrix.scss";

const NOTE_HEIGHT_IN_PIXELS = 20;
const NOTE_WIDTH_IN_PIXELS = 50;

export interface Point {
  x: number;
  y: number;
}

const Note = memo<
  SVGAttributes<SVGGElement> & {
    isDragging: boolean;
    selected: boolean;
    toggleSelected: () => void;
  }
>(({ isDragging, selected, toggleSelected, ...svgProps }) => {
  const handleMouseOver = useCallback(() => isDragging && toggleSelected(), [
    toggleSelected,
    isDragging,
  ]);

  const rectProps: Partial<
    React.SVGProps<SVGUseElement & SVGRectElement>
  > = useMemo(
    () => ({
      width: `${NOTE_WIDTH_IN_PIXELS}px`,
      height: `${NOTE_HEIGHT_IN_PIXELS}px`,
      // strokeWidth: "1px",
      className: classNames("note-row__note", selected && "note-selected"),
      onMouseDown: toggleSelected,
      onMouseOver: handleMouseOver,
    }),
    [handleMouseOver, selected, toggleSelected]
  );
  return <rect {...svgProps} {...rectProps} id="music-note" />;
});

export const NoteRow = memo<{
  rowNumber: number;
  isDragging: boolean;
  columns: number;
}>(({ rowNumber, isDragging, columns }) => {
  const [selectedNotes, toggleNote] = useMultipleToggles(columns, false);

  return (
    <g className="note-row__row">
      {[...Array(columns).keys()].map((num, index) => {
        const translatePoint: Point = {
          x: NOTE_WIDTH_IN_PIXELS * num,
          y: NOTE_HEIGHT_IN_PIXELS * rowNumber,
        };
        const toggleSelected = () => toggleNote(index);
        return (
          <Note
            key={num}
            selected={selectedNotes[index]}
            toggleSelected={toggleSelected}
            isDragging={isDragging}
            transform={`translate(${translatePoint.x}, ${translatePoint.y})`}
          />
        );
      })}
    </g>
  );
});

export const NoteMatrix = memo<{
  matrixSize: { rows: number; columns: number };
  translateTransform: Point;
}>(({ matrixSize, translateTransform }) => {
  const [isDragging, toggleIsDragging] = useToggle(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", toggleIsDragging);
    }
    return () => document.removeEventListener("mouseup", toggleIsDragging);
  }, [isDragging, toggleIsDragging]);

  return (
    <g
      onMouseDown={toggleIsDragging}
      transform={`translate(${translateTransform.x},${translateTransform.y})`}
    >
      {[...Array(matrixSize.rows).keys()].map((rowNumber) => (
        <NoteRow
          key={rowNumber}
          rowNumber={rowNumber}
          isDragging={isDragging}
          columns={matrixSize.columns}
        />
      ))}
    </g>
  );
});
