const fs = require('fs')

// Tolerant parser for VideoPsalm's JS-like format (unquoted keys, raw newlines in strings)
function parseVP(src) {
  src = src.replace(/^﻿/, '')
  let i = 0
  const BS = String.fromCharCode(92)
  const ws = () => { while (i < src.length && /\s/.test(src[i])) i++ }

  function val() {
    ws()
    const c = src[i]
    if (c === '{') return obj()
    if (c === '[') return arr()
    if (c === '"') return str()
    const m = /^-?\d+(\.\d+)?/.exec(src.slice(i, i + 30))
    if (m) { i += m[0].length; return Number(m[0]) }
    const w = /^(true|false|null)/.exec(src.slice(i, i + 6))
    if (w) { i += w[0].length; return JSON.parse(w[0]) }
    throw new Error('bad value at ' + i + ': ' + src.slice(i, i + 40))
  }

  function str() {
    i++
    let s = ''
    while (src[i] !== '"') {
      if (src[i] === BS) {
        const n = src[i + 1]
        if (n === 'n') s += '\n'
        else if (n === 't') s += '\t'
        else if (n === 'r') s += '\r'
        else if (n === 'u') { s += String.fromCharCode(parseInt(src.substr(i + 2, 4), 16)); i += 4 }
        else s += n
        i += 2
        continue
      }
      s += src[i++]
    }
    i++
    return s
  }

  function key() {
    ws()
    if (src[i] === '"') return str()
    const m = /^[A-Za-z_]\w*/.exec(src.slice(i, i + 60))
    if (!m) throw new Error('bad key at ' + i + ': ' + src.slice(i, i + 40))
    i += m[0].length
    return m[0]
  }

  function obj() {
    i++
    const o = {}
    ws()
    if (src[i] === '}') { i++; return o }
    for (;;) {
      const k = key()
      ws()
      if (src[i] !== ':') throw new Error('colon expected at ' + i)
      i++
      o[k] = val()
      ws()
      if (src[i] === ',') { i++; ws(); if (src[i] === '}') { i++; return o } continue }
      if (src[i] === '}') { i++; return o }
      throw new Error('obj error at ' + i + ': ' + src.slice(i, i + 40))
    }
  }

  function arr() {
    i++
    const a = []
    ws()
    if (src[i] === ']') { i++; return a }
    for (;;) {
      a.push(val())
      ws()
      if (src[i] === ',') { i++; ws(); if (src[i] === ']') { i++; return a } continue }
      if (src[i] === ']') { i++; return a }
      throw new Error('arr error at ' + i)
    }
  }

  return val()
}

module.exports = parseVP

if (require.main === module) {
  const d = parseVP(fs.readFileSync(process.argv[2], 'utf8'))
  console.log(Object.keys(d), d.Songs.length)
  const keys = {}, vkeys = {}, tags = {}
  d.Songs.forEach(s => {
    Object.keys(s).forEach(k => keys[k] = (keys[k] || 0) + 1)
    ;(s.Verses || []).forEach(v => {
      Object.keys(v).forEach(k => vkeys[k] = (vkeys[k] || 0) + 1)
      if (v.Tag !== undefined) tags[v.Tag] = (tags[v.Tag] || 0) + 1
    })
  })
  console.log('song keys', keys)
  console.log('verse keys', vkeys)
  console.log('tags', tags)
  fs.writeFileSync(__dirname + '/A-S.parsed.json', JSON.stringify(d, null, 1))
}
