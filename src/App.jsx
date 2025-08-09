import React, { useState, useEffect } from 'react'
import SongList from './components/SongList'
import SongView from './components/SongView'
import Playlists from './components/Playlists'
import Header from './components/Header'
import songsData from './data/Ch-CMI.json'

export default function App(){
  const [songs, setSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [playlists, setPlaylists] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme_dark')
    return saved ? saved === '1' : true
  })
  const [currentPage, setCurrentPage] = useState('list') // 'list' or 'song'

  useEffect(()=> {
    const src = songsData?.Songs ?? []
    setSongs(src)
  }, [])

  useEffect(()=>{
    const saved = localStorage.getItem('chant_playlists')
    if(saved) setPlaylists(JSON.parse(saved))
  },[])

  useEffect(()=>{
    localStorage.setItem('chant_playlists', JSON.stringify(playlists))
  },[playlists])

  useEffect(() => {
    const html = document.documentElement
    if (isDark) html.classList.add('dark')
    else html.classList.remove('dark')
    localStorage.setItem('theme_dark', isDark ? '1' : '0')
  }, [isDark])

  const createPlaylist = (name) => {
    if(!name) return
    setPlaylists(p => ({ ...p, [name]: [] }))
  }

  const addToPlaylist = (playlistName, songGuid) => {
    setPlaylists(p => {
      const list = new Set(p[playlistName] ?? [])
      list.add(songGuid)
      return { ...p, [playlistName]: Array.from(list) }
    })
  }

  const removeFromPlaylist = (playlistName, songGuid) => {
    setPlaylists(p => {
      const arr = (p[playlistName] ?? []).filter(g => g !== songGuid)
      return { ...p, [playlistName]: arr }
    })
  }

  const deletePlaylist = (playlistName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la playlist "${playlistName}" ?`)) {
      setPlaylists(p => {
        const newPlaylists = { ...p }
        delete newPlaylists[playlistName]
        return newPlaylists
      })
    }
  }

  const normalizeText = (val) => (val ?? '').toString().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
  const filteredSongs = songs.filter(s => {
    const haystack = `${s.Title ?? ''} ${s.Lyrics ?? ''}`
    return normalizeText(haystack).includes(normalizeText(searchQuery))
  })

  const handleSongSelect = (song) => {
    setCurrentSong(song)
    setCurrentPage('song')
  }

  const handleBackToList = () => {
    setCurrentPage('list')
    setCurrentSong(null)
  }

  return (
    <div className="content-shell">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleSidebar={() => setIsSidebarOpen(v => !v)}
        onToggleDark={() => setIsDark(v => !v)}
      />

      {/* Mobile overlay for sidebar */}
      <div className={`overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)} />

      <div className="container">
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="p-12">
            <Playlists
              playlists={playlists}
              createPlaylist={createPlaylist}
              songs={songs}
              onSelectSongGuid={(guid) => {
                const s = songs.find(x => x.Title === guid)
                handleSongSelect(s)
                setIsSidebarOpen(false)
              }}
              removeFromPlaylist={removeFromPlaylist}
              deletePlaylist={deletePlaylist}
            />
          </div>
        </div>

        <div className="main-scroll column">
          {currentPage === 'list' ? (
            <div className="surface p-12">
              <SongList songs={filteredSongs} onSelectSong={handleSongSelect} />
            </div>
          ) : (
            <div className="surface p-16">
              <div style={{ marginBottom: '20px' }}>
                <button 
                  onClick={handleBackToList}
                  style={{ 
                    background: 'none',
                    border: 'none',
                    color: 'var(--text)',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateX(-4px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateX(0)'}
                >
                  ←
                </button>
              </div>
              <SongView song={currentSong} playlists={playlists} onAddToPlaylist={addToPlaylist} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
