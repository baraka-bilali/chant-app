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

  const normalizeText = (val) => (val ?? '').toString().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
  const filteredSongs = songs.filter(s => {
    const haystack = `${s.Title ?? ''} ${s.Lyrics ?? ''}`
    return normalizeText(haystack).includes(normalizeText(searchQuery))
  })

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Oxygen' }}>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div style={{ maxWidth: 1100, margin: '20px auto', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        <div>
          <Playlists
            playlists={playlists}
            createPlaylist={createPlaylist}
            songs={songs}
            onSelectSongGuid={(guid) => {
              const s = songs.find(x => x.Guid === guid)
              setCurrentSong(s)
            }}
            removeFromPlaylist={removeFromPlaylist}
          />
        </div>
          
        <div>
          <SongList songs={filteredSongs} onSelectSong={(s)=> setCurrentSong(s)} />
          <div style={{ height: 20 }} />
          <SongView song={currentSong} onAddToPlaylist={addToPlaylist} />
        </div>
      </div>
    </div>
  )
}
