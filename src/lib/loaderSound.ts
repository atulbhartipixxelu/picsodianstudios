type WindowWithWebkit = Window & {
  webkitAudioContext?: typeof AudioContext;
};

let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || (window as WindowWithWebkit).webkitAudioContext;
  if (!Ctx) return null;
  if (!ctx) ctx = new Ctx();
  return ctx;
}

export function unlockLoaderAudio() {
  const c = audio();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
}

export function playCountSound(kind: "tick" | "go") {
  const c = audio();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  if (c.state !== "running") return;

  const now = c.currentTime + 0.01;
  if (kind === "go") clap(c, now);
  else beep(c, now);
}

function beep(ctx: AudioContext, time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1000, time);
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.38, time + 0.01);
  gain.gain.linearRampToValueAtTime(0, time + 0.13);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.15);
}

function clap(ctx: AudioContext, time: number) {
  const length = Math.floor(ctx.sampleRate * 0.18);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.2);
  }

  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const noiseGain = ctx.createGain();
  src.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.value = 700;
  noiseGain.gain.setValueAtTime(0.45, time);
  noiseGain.gain.linearRampToValueAtTime(0, time + 0.16);
  src.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  src.start(time);

  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(220, time);
  oscGain.gain.setValueAtTime(0.28, time);
  oscGain.gain.linearRampToValueAtTime(0, time + 0.16);
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.18);
}
