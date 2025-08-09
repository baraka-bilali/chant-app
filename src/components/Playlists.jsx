import React, { useState } from 'react'

export default function Playlists({ playlists = {}, createPlaylist, songs = [], onSelectSongGuid, removeFromPlaylist }){
  const [name, setName] = useState('')

  return (
    <div style={{ background: '#fff', padding: 12, borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <h3 style={{ marginTop: 0 }}>Playlists</h3>

      <div style={{ display: 'flex', gap: 8 }}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nom playlist" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
        <button onClick={()=>{ if(name.trim()){ createPlaylist(name.trim()); setName('') }}} style={{ padding: '8px 12px', borderRadius: 6, background: '#10b981', color: '#fff', border: 'none' }}>Créer</button>
      </div>

      <div style={{ marginTop: 12 }}>
        {Object.keys(playlists).length === 0 && <div style={{ color: '#666' }}>Aucune playlist</div>}

        {Object.entries(playlists).map(([pname, guids])=>(
          <div key={pname} style={{ border: '1px solid #f3f4f6', padding: 8, borderRadius: 6, marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{pname}</strong>
              <span style={{ color: '#888', fontSize: 12 }}>{guids.length} chants</span>
            </div>
            <div style={{ marginTop: 8, maxHeight: 200, overflow: 'auto' }}>
              {guids.map(g => {
                const s = songs.find(x=>x.Guid === g)
                return (
                  <div key={g} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                    <button onClick={()=>onSelectSongGuid(g)} style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>{s?.Text ?? g}</button>
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
