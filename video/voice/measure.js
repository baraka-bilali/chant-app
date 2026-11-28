// Reads public/voice/*.wav durations and writes src/voice.json for the composition.
const fs = require('fs')
const path = require('path')

const FPS = 30
const lines = require('./lines.json')
const out = lines.map((l) => {
  const b = fs.readFileSync(path.join(__dirname, '..', 'public', 'voice', l.id + '.wav'))
  let p = 12
  let byteRate = 0
  let data = 0
  while (p < b.length) {
    const id = b.toString('ascii', p, p + 4)
    const size = b.readUInt32LE(p + 4)
    if (id === 'fmt ') byteRate = b.readUInt32LE(p + 16)
    if (id === 'data') { data = size; break }
    p += 8 + size
  }
  const seconds = data / byteRate
  return { id: l.id, scene: l.scene, from: Math.round(l.at * FPS), frames: Math.ceil(seconds * FPS) }
})
fs.writeFileSync(path.join(__dirname, '..', 'src', 'voice.json'), JSON.stringify(out, null, 2) + '\n')
for (const v of out) console.log(v.id.padEnd(14), v.scene.padEnd(10), 'from', v.from, 'frames', v.frames, '-> ends', v.from + v.frames)
