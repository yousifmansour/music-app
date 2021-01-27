import classNames from "classnames";
import React, { memo, useCallback, useEffect } from "react";
import { useToggle } from "../../hooks/use-toggle";
import "./note-row.css";

const ROW_LENGTH: number = 64 / 2;

const Note = memo<{ isDragging: boolean }>(({ isDragging }) => {
  const [selected, toggleSelected] = useToggle(false);
  const handleMouseOver = useCallback(
    (event: React.MouseEvent) => isDragging && toggleSelected(),
    [toggleSelected, isDragging]
  );
  return (
    <div
      draggable={false}
      style={{ flexBasis: `${100 / ROW_LENGTH}%` }}
      className={classNames("note-row__note", selected && "note-selected")}
      onClick={toggleSelected}
      onMouseOver={handleMouseOver}
    />
  );
});

export const NoteRow = () => {
  const [isDragging, toggleIsDragging] = useToggle(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", toggleIsDragging);
    }
    return () => document.removeEventListener("mouseup", toggleIsDragging);
  }, [isDragging, toggleIsDragging]);

  return (
    <div
      draggable={false}
      className="note-row__row"
      onMouseDown={toggleIsDragging}
    >
      {[...Array(ROW_LENGTH).keys()].map((num) => (
        <Note key={num} isDragging={isDragging} />
      ))}
    </div>
  );
};
