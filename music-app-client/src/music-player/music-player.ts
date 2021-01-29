// TODO: see https://github.com/kevincennis/TinyMusic

function noteToHz(note: number) {
  return Math.pow(Math.pow(2, 1 / 12), note - 49) * 440;
}

// create web audio api context
// create Oscillator node
let audioCtx = new window.AudioContext();
let oscillator = audioCtx.createOscillator();

let started = false;

export function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new window.AudioContext();
  }
  return audioCtx;
}

export function getOscillator() {
  if (!oscillator || !started) {
    oscillator = getAudioCtx().createOscillator();
  }
  return oscillator;
}

export function stopSound() {
  getOscillator().stop();
  started = false;
}

function playNote({
  note,
  osc,
  length,
}: {
  note: number;
  osc: OscillatorNode;
  length: number;
}) {
  osc.frequency.setValueAtTime(
    noteToHz(note),
    getAudioCtx().currentTime + length
  );
}

export function playSound(notes: number[]) {
  const osc = getOscillator();
  osc.type = "sine";
  osc.connect(audioCtx.destination);

  const bpm = 120;

  notes.forEach((note, index) => {
    playNote({ note, osc, length: (index * 60) / bpm });
  });

  if (!started) {
    osc.start();
    started = true;
  }
  setTimeout(() => {
    playSound(notes);
  }, ((notes.length * 60) / bpm) * 1000);
}
