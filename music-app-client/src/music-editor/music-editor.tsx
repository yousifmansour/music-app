import React, { useEffect, useState } from "react";
import "./music-editor.css";
import { NoteMatrix } from "./note-matrix/note-matrix";

const MATRIX_SIZE = { columns: 128, rows: 16 };
const isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;

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

  useEffect(() => {
    const handleMouseWheel = (event: WheelEvent) => {
      setTranslateTransform({
        x: -(event.deltaX * deltaScaling || 0) + translateTransform.x,
        // y: 0,
        y: -(event.deltaY * deltaScaling || 0) + translateTransform.y,
      });
    };
    document.addEventListener("wheel", handleMouseWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleMouseWheel);
  }, [deltaScaling, translateTransform.x, translateTransform.y]);

  return (
    <>
      <div style={{ overflowX: "visible", overflowY: "visible" }}>
        <h1>Music App</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="music-editor-svg-layer"
        >
          <NoteMatrix
            matrixSize={MATRIX_SIZE}
            translateTransform={translateTransform}
          />
          {/* <NoteMatrix
            matrixSize={MATRIX_SIZE}
            translateTransform={{
              x: translateTransform.x,
              y: MATRIX_SIZE.rows * 16 + 32 + translateTransform.y,
            }}
          /> */}
        </svg>
      </div>
    </>
  );
};
