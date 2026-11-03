// The piano's sounds, all synthesized with Web Audio (no audio files), in four instruments:
// a soft piano, a detuned "haunted" piano in a big reverb, a warm analog-style synth and a
// plucked guitar. The AudioContext is created on first use, which browsers only allow after a
// user gesture.

let ctx: AudioContext | null = null;

function context() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

// Frequency of a note given semitones above middle C (C4 = 261.63 Hz).
export const noteFrequency = (semitones: number) =>
  261.63 * 2 ** (semitones / 12);

export const INSTRUMENTS = ["piano", "haunted", "synth", "guitar"] as const;
export type Instrument = (typeof INSTRUMENTS)[number];

// Shared reverbs, built once per AudioContext from a generated impulse (decaying stereo noise).
const reverbs = new Map<string, ConvolverNode>();
function reverb(audio: AudioContext, seconds: number, decay: number) {
  const key = `${seconds}:${decay}`;
  let node = reverbs.get(key);
  if (!node) {
    const length = Math.floor(audio.sampleRate * seconds);
    const impulse = audio.createBuffer(2, length, audio.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++)
        data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** decay;
    }
    node = audio.createConvolver();
    node.buffer = impulse;
    node.connect(audio.destination);
    reverbs.set(key, node);
  }
  return node;
}

// A voice's output: an envelope that goes to the speakers, plus an optional reverb send.
function voice(
  audio: AudioContext,
  at: number,
  peak: number,
  attack: number,
  release: number,
  send?: { room: ConvolverNode; level: number },
) {
  const out = audio.createGain();
  out.gain.setValueAtTime(0.0001, at);
  out.gain.exponentialRampToValueAtTime(peak, at + attack);
  out.gain.exponentialRampToValueAtTime(0.0001, at + release);
  out.connect(audio.destination);
  if (send) {
    const wet = audio.createGain();
    wet.gain.value = send.level;
    out.connect(wet).connect(send.room);
  }
  return out;
}

function osc(
  audio: AudioContext,
  type: OscillatorType,
  freq: number,
  at: number,
  stop: number,
  detune = 0,
) {
  const node = audio.createOscillator();
  node.type = type;
  node.frequency.value = freq;
  node.detune.value = detune;
  node.start(at);
  node.stop(stop);
  return node;
}

const PIANO_PARTIALS = [
  { ratio: 1, gain: 0.6 },
  { ratio: 2, gain: 0.22 },
  { ratio: 3, gain: 0.08 },
  { ratio: 4, gain: 0.04 },
];

// How a real piano changes across its range, for a note of frequency f: low notes ring longer,
// sound fuller (stronger overtones) and a touch louder; high notes are shorter and purer. Real
// strings are also slightly stiff, so their overtones sit a little sharp of exact multiples
// (more so up high), which is part of what makes it sound like a piano rather than an organ.
function pianoRange(f: number) {
  const octaves = Math.log2(f / 261.63); // 0 at middle C, -1 an octave below, +1 above
  return {
    ring: 2 ** (-0.45 * octaves), // decay-length multiplier
    overtones: 2 ** (-0.6 * octaves), // overtone-level multiplier
    level: 2 ** (-0.15 * octaves), // loudness multiplier
    // Overtone n relative to the fundamental, which itself stays exactly in tune.
    stretch: (n: number) => {
      const b = 0.0004 * 2 ** octaves;
      return (n * Math.sqrt(1 + b * n * n)) / Math.sqrt(1 + b);
    },
  };
}

// The original soft piano: a few sine partials with a fast attack and a soft decay, shaped by
// where the note sits on the keyboard.
function piano(audio: AudioContext, f: number, at: number) {
  const range = pianoRange(f);
  const decay = 1.6 * range.ring;
  const out = voice(audio, at, 0.35 * range.level, 0.01, decay);
  for (const { ratio, gain } of PIANO_PARTIALS) {
    const level = audio.createGain();
    level.gain.value =
      ratio === 1 ? gain : Math.min(0.5, gain * range.overtones);
    osc(audio, "sine", f * range.stretch(ratio), at, at + decay + 0.1)
      .connect(level)
      .connect(out);
  }
}

// An old, slightly out-of-tune piano in an empty hall: two beating, detuned tones with a slow
// wobble, a long tail and lots of reverb (shaped across the keyboard like the soft piano).
function haunted(audio: AudioContext, f: number, at: number) {
  const range = pianoRange(f);
  const decay = 3.2 * range.ring;
  const out = voice(audio, at, 0.2 * range.level, 0.02, decay, {
    room: reverb(audio, 3.4, 2.4),
    level: 0.9,
  });
  const wobble = osc(audio, "sine", 4.5, at, at + decay + 0.1);
  const depth = audio.createGain();
  depth.gain.value = 7; // cents
  wobble.connect(depth);
  for (const { ratio, cents, gain } of [
    { ratio: 1, cents: -7, gain: 0.45 },
    { ratio: 1, cents: 8, gain: 0.4 },
    { ratio: 2, cents: -14, gain: 0.14 },
    { ratio: 3, cents: 5, gain: 0.05 },
  ]) {
    const tone = osc(
      audio,
      "sine",
      f * range.stretch(ratio),
      at,
      at + decay + 0.1,
      cents,
    );
    depth.connect(tone.detune);
    const level = audio.createGain();
    level.gain.value =
      ratio === 1 ? gain : Math.min(0.4, gain * range.overtones);
    tone.connect(level).connect(out);
  }
}

// A warm analog-style synth: two detuned saws and a sub, through a resonant filter that closes.
function synth(audio: AudioContext, f: number, at: number) {
  const out = voice(audio, at, 0.13, 0.008, 1.4, {
    room: reverb(audio, 1.4, 3),
    level: 0.35,
  });
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 6;
  filter.frequency.setValueAtTime(3200, at);
  filter.frequency.exponentialRampToValueAtTime(650, at + 0.5);
  filter.connect(out);
  osc(audio, "sawtooth", f, at, at + 1.5, -8).connect(filter);
  osc(audio, "sawtooth", f, at, at + 1.5, 8).connect(filter);
  const sub = audio.createGain();
  sub.gain.value = 0.35;
  osc(audio, "square", f / 2, at, at + 1.5)
    .connect(sub)
    .connect(filter);
}

// A soft plucked nylon string: a bright attack that quickly mellows, a tiny settle in pitch and
// a little pick noise.
function guitar(audio: AudioContext, f: number, at: number) {
  const out = voice(audio, at, 0.2, 0.003, 1.5, {
    room: reverb(audio, 1.4, 3),
    level: 0.25,
  });
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 1;
  filter.frequency.setValueAtTime(5000, at);
  filter.frequency.exponentialRampToValueAtTime(900, at + 0.25);
  filter.connect(out);
  for (const [type, gain] of [
    ["sawtooth", 0.5],
    ["triangle", 0.8],
  ] as const) {
    const tone = osc(audio, type, f, at, at + 1.6);
    tone.frequency.setValueAtTime(f * 1.006, at);
    tone.frequency.exponentialRampToValueAtTime(f, at + 0.03);
    const level = audio.createGain();
    level.gain.value = gain;
    tone.connect(level).connect(filter);
  }
  burst(audio, at, 2200, 0.06, 0.015, 1.5);
}

const VOICES: Record<
  Instrument,
  (audio: AudioContext, f: number, at: number) => void
> = { piano, haunted, synth, guitar };

export function playNote(frequency: number, instrument: Instrument = "piano") {
  const audio = context();
  VOICES[instrument](audio, frequency, audio.currentTime);
}

// --- Break and repair effects --------------------------------------------------------------
// Small foley, synthesized and mixed low so it sits under the piano notes.
// Breaking sounds like wooden toy building blocks tumbling down: hollow "tock"s that bounce a
// couple of times. Repairing sounds like little tools at work: a ratchet clicking, a few light
// hammer taps, and a metal clink when it's done.

let noise: AudioBuffer | null = null;
function noiseBuffer(audio: AudioContext) {
  if (!noise) {
    noise = audio.createBuffer(1, audio.sampleRate * 0.25, audio.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noise;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

// One decaying sine partial.
function partial(
  audio: AudioContext,
  at: number,
  freq: number,
  volume: number,
  decay: number,
  drop = 1,
) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, at);
  if (drop !== 1)
    osc.frequency.exponentialRampToValueAtTime(freq * drop, at + decay);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(volume, at + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  osc.connect(gain).connect(audio.destination);
  osc.start(at);
  osc.stop(at + decay + 0.02);
}

// A short burst of filtered noise.
function burst(
  audio: AudioContext,
  at: number,
  freq: number,
  volume: number,
  decay: number,
  q = 4,
) {
  const src = audio.createBufferSource();
  const band = audio.createBiquadFilter();
  const gain = audio.createGain();
  src.buffer = noiseBuffer(audio);
  band.type = "bandpass";
  band.frequency.value = Math.min(freq, 10000);
  band.Q.value = q;
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(volume, at + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  src.connect(band).connect(gain).connect(audio.destination);
  src.start(at, rand(0, 0.2));
  src.stop(at + decay + 0.01);
}

// A wooden block hitting a table: a hollow, slightly inharmonic knock with a woody click.
function woodBlock(
  audio: AudioContext,
  at: number,
  freq: number,
  volume: number,
) {
  partial(audio, at, freq, volume, 0.07, 0.97);
  partial(audio, at, freq * 2.76, volume * 0.35, 0.04);
  burst(audio, at, freq * 3, volume * 0.5, 0.018, 2);
}

// The piano coming apart: a nervous rattle while it trembles, a burst of sharp cracks as it
// snaps (about 0.55s in, matching the animation), then a soft tumble of wooden knocks as the
// pieces fall away.
export function playBreakSound() {
  const audio = context();
  const now = audio.currentTime + 0.02;
  for (const t of [0.1, 0.22, 0.32, 0.4, 0.47])
    woodBlock(audio, now + t + rand(-0.02, 0.02), rand(1300, 1600), 0.022);
  for (let i = 0; i < 7; i++) {
    const at = now + 0.56 + i * rand(0.018, 0.035);
    burst(audio, at, rand(2800, 5200), rand(0.05, 0.08), rand(0.015, 0.03), 3);
    if (i % 2 === 0) woodBlock(audio, at + 0.005, rand(900, 1300), 0.04);
  }
  for (let i = 0; i < 6; i++) {
    woodBlock(
      audio,
      now + 0.72 + i * rand(0.06, 0.1),
      rand(500, 900),
      0.05 * (1 - i / 8),
    );
  }
}

// A piece of the broken piano hitting something: a short wooden knock, louder and a touch lower
// for harder hits (strength 0 to 1).
export function playKnock(strength: number) {
  const audio = context();
  woodBlock(
    audio,
    audio.currentTime + 0.005,
    rand(650, 1150) * (1 - strength * 0.25),
    0.012 + 0.055 * strength,
  );
}

// A ratchet: quick, even clicks, like a small screwdriver or wrench being turned.
function ratchet(
  audio: AudioContext,
  at: number,
  clicks: number,
  volume: number,
) {
  for (let i = 0; i < clicks; i++) {
    const t = at + i * rand(0.032, 0.04);
    burst(audio, t, rand(3800, 4600), volume, 0.012, 8);
    partial(audio, t, rand(2400, 2700), volume * 0.25, 0.01);
  }
}

// A light hammer tap: a soft low knock with a bit of attack.
function hammerTap(audio: AudioContext, at: number, volume: number) {
  partial(audio, at, rand(210, 250), volume, 0.12, 0.7);
  burst(audio, at, 1500, volume * 0.5, 0.025, 1.5);
}

// A small metal clink, like a tool touching metal: a few bright, slightly detuned partials.
function clink(audio: AudioContext, at: number, volume: number) {
  const base = rand(2100, 2400);
  for (const [ratio, level] of [
    [1, 1],
    [2.32, 0.5],
    [3.81, 0.3],
  ] as const)
    partial(audio, at, base * ratio, volume * level, 0.28);
}

// The repair: a ratchet turn, a couple of light hammer taps, then another ratchet turn as the
// last pieces are tightened into place.
export function playRepairSound() {
  const audio = context();
  const now = audio.currentTime + 0.02;
  ratchet(audio, now + 0.25, 7, 0.05);
  hammerTap(audio, now + 0.75, 0.09);
  hammerTap(audio, now + 0.95, 0.075);
  ratchet(audio, now + 1.3, 6, 0.045);
}

// Done: a last little clink of the tool and a soft knock as the piano settles.
export function playSettleSound() {
  const audio = context();
  const now = audio.currentTime + 0.01;
  clink(audio, now, 0.03);
  hammerTap(audio, now + 0.06, 0.05);
}
