import React from 'react'

export default function Header({ searchQuery = '', onSearchChange = () => {} }){
  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #eee', padding: 12 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Receuil — Centre Missionnaire de Pascal</h1>
        <div style={{ color: '#666', fontSize: 12 }}>Chargé depuis Cantique.json</div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <input
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Rechercher un chant (titre ou paroles)"
            style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', outline: 'none' }}
          />
        </div>
      </div>
    </header>
  )
}
