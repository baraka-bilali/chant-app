import React from 'react'

export default function Header({
  searchQuery = '',
  onSearchChange = () => {},
  onToggleSidebar = () => {},
  onToggleDark = () => {},
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="hidden-desktop">
          <button className="btn-cta" onClick={onToggleSidebar} aria-label="Toggle sidebar">
            <span className="hamburger">☰</span>
            <span>Playlists</span>
          </button>
        </div>
        <div>
          <div className="brand">Receuil — Centre Missionnaire de Pascal</div>
          <div className="subtle">Chargé depuis Cantique.json</div>
        </div>
        <div className="header-actions hidden-desktop">
          <button className="theme-toggle" onClick={onToggleDark} aria-label="Toggle theme">
            <span className="icon">☀️</span>
            <span className="icon">🌙</span>
            <span className="knob" />
          </button>
        </div>
      </div>
      <div className="header-inner" style={{ gridTemplateColumns: '1fr auto', paddingTop: 0 }}>
        <div className="search">
          <input
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Rechercher un chant (titre ou paroles)"
          />
        </div>
        <div className="header-actions hidden-mobile">
          <button className="theme-toggle" onClick={onToggleDark} aria-label="Toggle theme">
            <span className="icon">☀️</span>
            <span className="icon">🌙</span>
            <span className="knob" />
          </button>
        </div>
      </div>
    </header>
  )
}
