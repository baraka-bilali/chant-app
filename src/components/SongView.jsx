import React, { useEffect, useRef, useState } from 'react'

export default function SongView({ song, onAddToPlaylist, playlists = {} }) {
  const containerRef = useRef()
  const [pickerOpen, setPickerOpen] = useState(false)

  if (!song) {
    return <div>Clique un titre pour voir les paroles.</div>
  }

  return (
    <div ref={containerRef}>
      <h2 style={{ marginTop: 0 }}>{song.Title}</h2>
      <div className="mb-12" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          className="btn-cta"
          onClick={() => setPickerOpen(v => !v)}
          aria-expanded={pickerOpen}
        >
          Ajouter à une playlist +
        </button>
      </div>
      {pickerOpen && (
        <PlaylistPicker onPick={(name) => { onAddToPlaylist(name, song.Title); setPickerOpen(false) }} existing={Object.keys(playlists)} />
      )}

      <div style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
        {song.Lyrics}
      </div>
    </div>
  )
}

function PlaylistPicker({ onPick, existing = [] }) {
  const selectRef = useRef(null)
  const inputRef = useRef(null)

  return (
    <div className="mb-12" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <div className="surface" style={{ padding: 6, borderRadius: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
        <select ref={selectRef} style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}>
          <option value="">Choisir playlist…</option>
          {existing.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <span className="muted-text" style={{ fontSize: 12 }}>ou</span>
        <input ref={inputRef} placeholder="Créer nouvelle" style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }} />
        <button
          className="btn-ghost"
          style={{ background: 'linear-gradient(180deg, #22c55e, #16a34a 70%, #15803d)', color: '#0b0c0f', borderColor: 'transparent' }}
          onClick={() => {
            const chosen = selectRef.current?.value?.trim()
            const created = inputRef.current?.value?.trim()
            const finalName = created || chosen
            if (finalName) onPick(finalName)
          }}
        >
          Ajouter +
        </button>
      </div>
    </div>
  )
}
