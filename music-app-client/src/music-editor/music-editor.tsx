import React, { useCallback, useEffect, useState } from "react";
import { AudioControls } from "./audio-controls/audio-controls";
import "./music-editor.css";
import { NoteMatrix } from "./note-matrix/note-matrix";
import { ScrollBar } from "./scrollbar";

const MATRIX_SIZE = { columns: 64, rows: 24 };
const isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;

export const NOTE_HEIGHT_IN_PIXELS = 20;
export const NOTE_WIDTH_IN_PIXELS = 50;

export interface Point {
  x: number;
  y: number;
}

export const MusicEditor = () => {
  const [translateTransform, setTranslateTransform] = useState<Point>({
    x: 0,
    y: 0,
  });
  const deltaScaling = isFirefox ? 24 : 1;

  const handleUpdatingTranslateTransform = useCallback(
    (updateValue: Point) =>
      setTranslateTransform({
        x: updateValue.x + translateTransform.x,
        y: updateValue.y + translateTransform.y,
      }),
    [translateTransform]
  );

  useEffect(() => {
    const handleMouseWheel = (event: WheelEvent) => {
      handleUpdatingTranslateTransform({
        x: -(event.deltaX * deltaScaling || 0),
        y: 0,
        // y: -(event.deltaY * deltaScaling || 0) + translateTransform.y,
      });
    };
    document.addEventListener("wheel", handleMouseWheel);
    return () => document.removeEventListener("wheel", handleMouseWheel);
  }, [deltaScaling, handleUpdatingTranslateTransform]);

  return (
    <>
      <div style={{ overflowX: "visible", overflowY: "visible" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1>Music App</h1>
          <AudioControls />
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="music-editor-svg-layer"
          transform={`translate(${translateTransform.x},${translateTransform.y})`}
        >
          <NoteMatrix matrixSize={MATRIX_SIZE} />
          {/* <NoteMatrix
            matrixSize={MATRIX_SIZE}
            translateTransform={{
              x: translateTransform.x,
              y: MATRIX_SIZE.rows * 16 + 32 + translateTransform.y,
            }}
          /> */}
          <ScrollBar
            width={MATRIX_SIZE.columns * NOTE_WIDTH_IN_PIXELS}
            height={16}
            translate={{
              x: 0,
              y: 16 + MATRIX_SIZE.rows * NOTE_HEIGHT_IN_PIXELS,
            }}
            updatePosition={handleUpdatingTranslateTransform}
          />
        </svg>
      </div>
    </>
  );
};
