// Usage: node scripts/convert-videopsalm.js "C:/Users/Public/Documents/VideoPsalm/SongBooks/A-S.json" src/data/A-S.json
// Add a third argument "full" to print the complete audit report.
// Convert a VideoPsalm songbook into the app's { Songs: [{ Number, Name, Lyrics, Guid }] } format.
// Rule: each distinct chorus is kept ONCE, at its first occurrence (normally right after verse 1).
const fs = require('fs')
const parseVP = require('./parse.js')

const [, , input, output] = process.argv
const book = parseVP(fs.readFileSync(input, 'utf8'))

const stripTags = (s) => s.replace(/<\/?[a-zA-Z][^>]*>/g, '')
const clean = (s) =>
  stripTags(s ?? '')
    .replace(/\r/g, '')
    .replace(/[ \t ]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const LABEL = '(?:chr|ch|chorus|chœurs?|choeurs?|r[ée]f(?:r?ain)?s?)'
const LABEL_LINE = new RegExp('^\\s*' + LABEL + '\\s*(?:\\d+\\s*)?[:.]\\s*(.*)$', 'i') // "Chr : text"
const LABEL_ONLY = new RegExp('^\\s*' + LABEL + '\\s*(?:\\d+\\s*)?[:.]?\\s*$', 'i') // "Chœur" alone on a line
const NUM_LINE = /^\s*(\d{1,2})\s*[.)\-]?\s*(\S.*)?$/ // "1. text" or "4"
const FIN_RE = /^\s*\(\s*fin\s*\)\s*$/i

const norm = (s) =>
  s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/œ/g, 'oe').replace(/[^a-z0-9]+/g, '')

function dice(a, b) {
  if (a === b) return 1
  if (a.length < 2 || b.length < 2) return 0
  const grams = (s) => { const m = new Map(); for (let i = 0; i < s.length - 1; i++) { const g = s.slice(i, i + 2); m.set(g, (m.get(g) || 0) + 1) } return m }
  const A = grams(a), B = grams(b)
  let inter = 0
  for (const [g, n] of A) inter += Math.min(n, B.get(g) || 0)
  return (2 * inter) / (a.length - 1 + b.length - 1)
}
const similar = (a, b) => {
  const x = norm(a), y = norm(b)
  if (!x || !y) return false
  return dice(x, y) >= 0.85 || x.includes(y) || y.includes(x)
}

// Split one slide into segments: verse start, chorus start, or continuation text.
function segments(text) {
  const segs = []
  let cur = null
  const push = () => { if (cur) { cur.text = cur.lines.join('\n').trim(); if (cur.text || cur.kind !== 'cont') segs.push(cur) } cur = null }
  const lines = text.split('\n')
  lines.forEach((line, i) => {
    if (FIN_RE.test(line)) return
    let m
    if ((m = LABEL_LINE.exec(line)) ) { push(); cur = { kind: 'chorus', lines: m[1] ? [m[1]] : [] }; return }
    if (LABEL_ONLY.test(line)) { push(); cur = { kind: 'chorus', lines: [] }; return }
    if ((m = NUM_LINE.exec(line)) && (i === 0 || /^\s*$/.test(lines[i - 1]) || m[2] === undefined || /^\s*\d{1,2}\s*[.)]/.test(line))) {
      // number line: only if it really looks like a verse number ("1." / "1" alone / "1. text")
      if (m[2] === undefined || /^\s*\d{1,2}\s*[.)]/.test(line)) { push(); cur = { kind: 'verse', n: Number(m[1]), lines: m[2] ? [m[2]] : [] }; return }
    }
    if (!cur) cur = { kind: 'cont', lines: [] }
    cur.lines.push(line)
  })
  push()
  return segs
}

const report = { total: 0, skipped: [], noTitleSlide: [], noVerseNumber: [], multiChorus: [], chorusNotAfterV1: [], noChorus: 0, withChorus: 0, droppedRepeats: 0, promotedChorus: [], emptyLyrics: [], dupIds: [], numberGaps: [] }
const songs = []
const seenIds = new Map()

for (const s of book.Songs) {
  report.total++
  const slides = (s.Verses ?? []).map((v) => ({ tag: v.Tag, text: clean(v.Text) })).filter((v) => v.text)
  const name = clean(s.Text)

  if (s.ID === undefined) { report.skipped.push(name); continue }

  // title slide = first slide when it is a single short unnumbered, unlabeled line
  let title
  const first = slides[0]
  if (first && !first.text.includes('\n') && first.text.length <= 80 && !NUM_LINE.test(first.text) && !LABEL_LINE.test(first.text) && !LABEL_ONLY.test(first.text)) {
    title = first.text
    slides.shift()
  } else {
    report.noTitleSlide.push(`${s.ID} ${name}`)
    title = name.toUpperCase()
  }

  // group slide segments into blocks: a block starts at a verse number or a chorus label;
  // unlabeled/unnumbered text continues the current block.
  const blocks = []
  for (const sl of slides) {
    for (const seg of segments(sl.text)) {
      if (seg.kind === 'verse') blocks.push({ type: 'verse', n: seg.n, pieces: seg.text ? [seg.text] : [] })
      else if (seg.kind === 'chorus') blocks.push({ type: 'chorus', pieces: seg.text ? [seg.text] : [] })
      else if (blocks.length) blocks[blocks.length - 1].pieces.push(seg.text)
      else { blocks.push({ type: 'verse', n: null, pieces: [seg.text] }); report.noVerseNumber.push(`${s.ID} ${name}`) }
    }
  }

  // inside a block, drop pieces already contained in an earlier piece of the same block
  for (const b of blocks) {
    const kept = []
    for (const p of b.pieces) {
      if (kept.some((k) => norm(k).includes(norm(p)))) continue
      kept.push(p)
    }
    b.pieces = kept
  }

  // unlabeled pieces that repeat identically after several verses are really an unlabeled chorus:
  // pull them out of the verses and make them a chorus block right after the verse.
  const verseBlocks = blocks.filter((b) => b.type === 'verse' && b.pieces.length > 1)
  const extraOf = (b) => b.pieces.slice(1).join('\n')
  const promote = new Set()
  verseBlocks.forEach((b) => {
    if (verseBlocks.filter((o) => o !== b && norm(extraOf(o)) && dice(norm(extraOf(o)), norm(extraOf(b))) >= 0.9).length >= 1) promote.add(b)
  })
  const flat = []
  for (const b of blocks) {
    if (promote.has(b)) {
      flat.push({ type: 'verse', n: b.n, text: b.pieces[0] ?? '' })
      flat.push({ type: 'chorus', text: extraOf(b) })
      report.promotedChorus.push(`${s.ID} ${name}`)
    } else flat.push({ type: b.type, n: b.n, text: b.pieces.join('\n') })
  }

  // dedupe choruses: keep each distinct chorus once, at first occurrence
  const kept = []
  const out = []
  let verseCount = 0
  for (const p of flat) {
    if (!p.text.trim() && p.type === 'chorus') continue
    if (p.type === 'verse') { verseCount++; out.push(p); continue }
    if (kept.some((k) => similar(k, p.text))) { report.droppedRepeats++; continue }
    kept.push(p.text)
    out.push(p)
    if (verseCount !== 1) report.chorusNotAfterV1.push(`${s.ID} ${name} (apres ${verseCount} couplet(s))`)
  }
  if (kept.length > 1) report.multiChorus.push(`${s.ID} ${name}`)
  kept.length ? report.withChorus++ : report.noChorus++

  const lyrics = out
    .map((p) => (p.type === 'verse' ? (p.n != null ? `${p.n}. ${p.text}` : p.text) : `Refrain : ${p.text}`))
    .join('\n')
    .trim()

  if (!lyrics) { report.emptyLyrics.push(`${s.ID} ${name}`); continue }

  // verse-number sanity: 1,2,3... in order
  const ns = out.filter((p) => p.type === 'verse' && p.n != null).map((p) => p.n)
  if (ns.some((n, i) => n !== i + 1)) report.numberGaps.push(`${s.ID} ${name} [${ns.join(',')}]`)

  if (seenIds.has(s.ID)) report.dupIds.push(`${s.ID}: ${name} / ${seenIds.get(s.ID)}`)
  seenIds.set(s.ID, name)

  // Display name = VideoPsalm's song name (normal case). Fully upper-case names become "Sentence case".
  const sentenceCase = (v) => (v === v.toUpperCase() && /[A-ZÀ-Ý]/.test(v) ? v.charAt(0) + v.slice(1).toLowerCase() : v)
  const displayName = sentenceCase(name.replace(/\s+/g, ' ') || title)
  songs.push({ Number: s.ID, Name: displayName, Lyrics: lyrics, Guid: s.Guid })
}

songs.sort((a, b) => a.Number - b.Number)
fs.writeFileSync(output, JSON.stringify({ Songs: songs }, null, 2) + '\n', 'utf8')

console.log('songs written:', songs.length, '/', report.total)
const full = process.argv[4] === 'full'
for (const [k, v] of Object.entries(report)) console.log(k + ':', Array.isArray(v) ? `${v.length} ${JSON.stringify(full ? v : v.slice(0, 10))}` : v)
