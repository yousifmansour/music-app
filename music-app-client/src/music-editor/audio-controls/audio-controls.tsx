import React, { useCallback } from "react";
import { useToggle } from "../../hooks/use-toggle";
import { playSound, stopSound } from "../../music-player/music-player";

const SAMPLE_MUSIC = [
  44,
  44,
  52,
  52,
  47,
  47,
  42,
  42,
  47,
  47,
  44,
  44,
  45,
  45,
  40,
  44,
];

export const AudioControls = () => {
  const [playing, togglePlaying] = useToggle(false);

  const handlePlay = useCallback(() => {
    togglePlaying();
    playSound(SAMPLE_MUSIC);
  }, [togglePlaying]);

  const handleStop = useCallback(() => {
    togglePlaying();
    stopSound();
  }, [togglePlaying]);

  return (
    <div>
      <button disabled={playing} onClick={handlePlay}>
        play
      </button>
      <button disabled={!playing} onClick={handleStop}>
        stop
      </button>
      {playing && (
        <span style={{ paddingLeft: "4px" }}>playing your music...</span>
      )}
    </div>
  );
};
