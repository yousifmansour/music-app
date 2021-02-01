import classNames from "classnames";
import React, {
  memo,
  SVGAttributes,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useMultipleToggles, useToggle } from "../../hooks/use-toggle";
import { NOTE_HEIGHT_IN_PIXELS, NOTE_WIDTH_IN_PIXELS } from "../music-editor";
import "./note-matrix.scss";

export interface Point {
  x: number;
  y: number;
}

const Note = memo<
  SVGAttributes<SVGGElement> & {
    isDragging: boolean;
    selected: boolean;
    toggleSelected: () => void;
    noteValue: string;
  }
>(({ isDragging, selected, toggleSelected, noteValue, ...svgProps }) => {
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
      className: classNames("note-row__note", selected && "note-selected"),
      onMouseDown: toggleSelected,
      onMouseOver: handleMouseOver,
    }),
    [handleMouseOver, selected, toggleSelected]
  );
  return (
    <>
      <rect {...svgProps} {...rectProps} id="music-note" />
      <g
        transform={`translate(${NOTE_WIDTH_IN_PIXELS / 2 - 4}, ${
          NOTE_HEIGHT_IN_PIXELS - 4
        })`}
      >
        <text fontSize="12" {...svgProps} style={{ userSelect: "none" }}>
          {noteValue}
        </text>
      </g>
    </>
  );
});

export const NoteRow = memo<{
  rowNumber: number;
  isDragging: boolean;
  columns: number;
  noteValue: string;
}>(({ rowNumber, isDragging, columns, noteValue }) => {
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
            noteValue={index === 0 ? noteValue : ""}
          />
        );
      })}
    </g>
  );
});

const OCTAVE_NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
].reverse();

export const NoteMatrix = memo<{
  matrixSize: { rows: number; columns: number };
}>(({ matrixSize }) => {
  const [isDragging, toggleIsDragging] = useToggle(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", toggleIsDragging);
    }
    return () => document.removeEventListener("mouseup", toggleIsDragging);
  }, [isDragging, toggleIsDragging]);

  return (
    <g onMouseDown={toggleIsDragging}>
      {[...Array(matrixSize.rows).keys()].map((rowNumber, index) => (
        <NoteRow
          key={rowNumber}
          rowNumber={rowNumber}
          isDragging={isDragging}
          columns={matrixSize.columns}
          noteValue={OCTAVE_NOTES[index % OCTAVE_NOTES.length]}
        />
      ))}
    </g>
  );
});
