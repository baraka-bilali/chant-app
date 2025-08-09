import React from 'react'

export default function SongList({ songs = [], onSelectSong }) {
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Liste des chants ({songs.length})</h2>
      {songs.length === 0 && (
        <div className="muted-text">Aucun résultat. Modifiez votre recherche.</div>
      )}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {songs.map((s, index) => (
          <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <button
              onClick={() => onSelectSong(s)}
              style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', width: '100%', color: 'inherit' }}
            >
              <div style={{ fontWeight: 600 }}>{s.Title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.Lyrics?.slice(0, 50)}...
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
