// Generates public/music.wav: a gentle, royalty-free worship-style pad + arpeggio (synthesized, no samples).
// Usage: node make-music.js [seconds]
const fs = require('fs')
const path = require('path')

const RATE = 44100
const SECONDS = Number(process.argv[2] ?? 62)
const N = Math.floor(RATE * SECONDS)

// Progression C – G – Am – F (4 s per chord), pad voicings and arpeggio notes.
const CHORD_SEC = 4
const PADS = [
  [130.81, 164.81, 196.0, 261.63],
  [98.0, 123.47, 146.83, 196.0],
  [110.0, 130.81, 164.81, 220.0],
  [87.31, 110.0, 130.81, 174.61],
]
const ARP = [
  [523.25, 659.25, 783.99, 1046.5],
  [493.88, 587.33, 783.99, 987.77],
  [440.0, 523.25, 659.25, 880.0],
  [440.0, 523.25, 698.46, 880.0],
]
const PATTERN = [0, 1, 2, 3, 2, 1, 2, 1]

const L = new Float32Array(N)
const R = new Float32Array(N)

// Pad: soft additive tones with slow attack/release, slightly detuned for width.
const chords = Math.ceil(SECONDS / CHORD_SEC) + 1
for (let c = 0; c < chords; c++) {
  const start = c * CHORD_SEC - 0.6
  const end = start + CHORD_SEC + 1.8
  const notes = PADS[c % PADS.length]
  const s0 = Math.max(0, Math.floor(start * RATE))
  const s1 = Math.min(N, Math.floor(end * RATE))
  for (let i = s0; i < s1; i++) {
    const t = i / RATE
    const local = t - start
    const len = end - start
    const env = Math.min(1, local / 1.2) * Math.min(1, (len - local) / 1.6)
    let l = 0
    let r = 0
    for (const f of notes) {
      const a = Math.sin(2 * Math.PI * f * t) + 0.28 * Math.sin(2 * Math.PI * 2 * f * t) + 0.08 * Math.sin(2 * Math.PI * 3 * f * t)
      const b = Math.sin(2 * Math.PI * f * 1.004 * t) + 0.28 * Math.sin(2 * Math.PI * 2 * f * 1.004 * t)
      l += a * 0.6 + b * 0.4
      r += a * 0.4 + b * 0.6
    }
    L[i] += l * env * 0.05
    R[i] += r * env * 0.05
  }
}

// Arpeggio: bell-like plucks every half second, starting after the intro swell.
const STEP = 0.5
for (let k = 0; k * STEP < SECONDS; k++) {
  const t0 = k * STEP
  if (t0 < 4) continue
  const chord = Math.floor(t0 / CHORD_SEC) % ARP.length
  const f = ARP[chord][PATTERN[k % PATTERN.length]]
  const pan = 0.5 + 0.35 * Math.sin(k * 1.7)
  const s0 = Math.floor(t0 * RATE)
  const s1 = Math.min(N, s0 + Math.floor(1.8 * RATE))
  for (let i = s0; i < s1; i++) {
    const t = (i - s0) / RATE
    const env = Math.exp(-t * 3.2) * Math.min(1, t / 0.004)
    const v = (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(2 * Math.PI * 2 * f * t) + 0.06 * Math.sin(2 * Math.PI * 3.01 * f * t)) * env * 0.055
    L[i] += v * (1 - pan)
    R[i] += v * pan
  }
}

// Simple stereo echo for space.
function echo(buf, delaySec, feedback) {
  const d = Math.floor(delaySec * RATE)
  for (let i = d; i < N; i++) buf[i] += buf[i - d] * feedback
}
echo(L, 0.37, 0.32)
echo(R, 0.49, 0.3)

// Master fades and normalisation to about -3 dBFS.
let peak = 0
for (let i = 0; i < N; i++) {
  const t = i / RATE
  const fade = Math.min(1, t / 2.5) * Math.min(1, (SECONDS - t) / 3.5)
  L[i] *= fade
  R[i] *= fade
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]))
}
const gain = 0.7 / peak

const out = Buffer.alloc(44 + N * 4)
out.write('RIFF', 0)
out.writeUInt32LE(36 + N * 4, 4)
out.write('WAVE', 8)
out.write('fmt ', 12)
out.writeUInt32LE(16, 16)
out.writeUInt16LE(1, 20)
out.writeUInt16LE(2, 22)
out.writeUInt32LE(RATE, 24)
out.writeUInt32LE(RATE * 4, 28)
out.writeUInt16LE(4, 32)
out.writeUInt16LE(16, 34)
out.write('data', 36)
out.writeUInt32LE(N * 4, 40)
for (let i = 0; i < N; i++) {
  out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * gain)) * 32767), 44 + i * 4)
  out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * gain)) * 32767), 46 + i * 4)
}
fs.writeFileSync(path.join(__dirname, 'public', 'music.wav'), out)
console.log(`music.wav written (${SECONDS}s, ${(out.length / 1e6).toFixed(1)} MB)`)
