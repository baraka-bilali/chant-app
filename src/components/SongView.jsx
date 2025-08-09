import React, { useEffect, useRef } from 'react'

export default function SongView({ song, onAddToPlaylist }) {
  const containerRef = useRef()

  useEffect(() => {
    if (song && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [song])

  if (!song) {
    return <div style={{ background: '#fff', padding: 12, borderRadius: 6 }}>Clique un titre pour voir les paroles.</div>
  }

  return (
    <div ref={containerRef} style={{ background: '#fff', padding: 16, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <h2 style={{ marginTop: 0 }}>{song.Title}</h2>
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => {
            const name = prompt('Nom de la playlist (ex: Mes chants)')
            if (name) onAddToPlaylist(name.trim(), song.Title)
          }}
          style={{ padding: '8px 12px', borderRadius: 6, border: 'none', background: '#2563eb', color: '#fff' }}
        >
          Ajouter à une playlist
        </button>
      </div>

      <div style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
        {song.Lyrics}
      </div>
    </div>
  )
}
