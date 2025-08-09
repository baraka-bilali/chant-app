import React from 'react'

export default function SongList({ songs = [], onSelectSong }) {
  return (
    <div style={{ background: '#fff', padding: 12, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <h2 style={{ marginTop: 0 }}>Liste des chants ({songs.length})</h2>
      {songs.length === 0 && (
        <div style={{ color: '#666' }}>Aucun résultat. Modifiez votre recherche.</div>
      )}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {songs.map((s, index) => (
          <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid #f1f1f1' }}>
            <button
              onClick={() => onSelectSong(s)}
              style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', width: '100%' }}
            >
              <div style={{ fontWeight: 600 }}>{s.Title}</div>
              {/* Optionnel : afficher un aperçu du texte */}
              <div style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.Lyrics?.slice(0, 50)}...
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
