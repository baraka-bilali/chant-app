import React, { useState } from 'react'

export default function Playlists({ playlists = {}, createPlaylist, songs = [], onSelectSongGuid, removeFromPlaylist, deletePlaylist }){
  const [name, setName] = useState('')

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Playlists</h3>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          placeholder="Nom playlist"
          style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
        />
        <button
          onClick={()=>{ if(name.trim()){ createPlaylist(name.trim()); setName('') }}}
          className="btn-ghost"
          style={{ background: 'linear-gradient(180deg, #60a5fa, #3b82f6 70%, #2563eb)', color: '#fff', borderColor: 'transparent' }}
        >Créer</button>
      </div>

      <div className="mt-12">
        {Object.keys(playlists).length === 0 && <div className="muted-text">Aucune playlist</div>}

        {Object.entries(playlists).map(([pname, guids])=> (
          <div key={pname} className="surface" style={{ padding: 8, borderRadius: 8, marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>{pname}</strong>
                <span className="muted-text" style={{ fontSize: 12 }}>{guids.length} chants</span>
              </div>
              <button
                className="btn-ghost"
                onClick={() => {
                  if (confirm(`Supprimer la playlist « ${pname} » ?`)) deletePlaylist?.(pname)
                }}
                style={{ color: '#ef4444' }}
              >
                Supprimer
              </button>
            </div>
            <div style={{ marginTop: 8, maxHeight: 200, overflow: 'auto' }}>
              {guids.map(g => {
                const s = songs.find(x=>x.Title === g)
                return (
                  <div key={g} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                    <button onClick={()=>onSelectSongGuid(g)} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'inherit' }}>{s?.Title ?? g}</button>
                    <button onClick={()=>removeFromPlaylist(pname, g)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}>Retirer</button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
