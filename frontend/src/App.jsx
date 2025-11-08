import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { songs, moods } from './data/songs'
import './App.css'

function App() {
  const [currentMood, setCurrentMood] = useState(null)
  const [activeTab, setActiveTab] = useState('home')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('musicMoodFavorites') || '[]')
    } catch {
      return []
    }
  })
  const [moodHistory, setMoodHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('musicMoodHistory') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('musicMoodFavorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('musicMoodHistory', JSON.stringify(moodHistory))
  }, [moodHistory])

  function toggleFavorite(id, song) {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === id)
      if (exists) return prev.filter(f => f.id !== id)
      return [...prev, { id, ...song }]
    })
  }

  function handleMoodClick(mood) {
    setCurrentMood(mood)
    setActiveTab('home')
    setMoodHistory(prev => [...prev, { mood, timestamp: new Date().toISOString() }])
  }

  const getSongsByMood = (mood) => {
    let moodSongs = songs[mood] || []
    if (selectedLanguage !== 'all') {
      moodSongs = moodSongs.filter(s => s.language === selectedLanguage)
    }
    return moodSongs
  }

  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    energetic: '⚡',
    romantic: '💘',
    chill: '🌙',
    angry: '😤'
  }

  const moodColors = {
    happy: { primary: '#FFD700', accent: '#FFA500', rgb: '255, 215, 0' },
    sad: { primary: '#4169E1', accent: '#87CEEB', rgb: '65, 105, 225' },
    energetic: { primary: '#FF4500', accent: '#FF6347', rgb: '255, 69, 0' },
    romantic: { primary: '#FF1493', accent: '#FFB6C1', rgb: '255, 20, 147' },
    chill: { primary: '#20B2AA', accent: '#48D1CC', rgb: '32, 178, 170' },
    angry: { primary: '#DC143C', accent: '#FF0000', rgb: '220, 20, 60' }
  }

  // Apply mood-based theme
  useEffect(() => {
    if (currentMood && moodColors[currentMood]) {
      const colors = moodColors[currentMood]
      document.documentElement.style.setProperty('--primary', colors.primary)
      document.documentElement.style.setProperty('--accent', colors.accent)
      document.body.className = `mood-${currentMood}`
    } else {
      document.documentElement.style.setProperty('--primary', '#7c4dff')
      document.documentElement.style.setProperty('--accent', '#00e5ff')
      document.body.className = ''
    }
  }, [currentMood])

  return (
    <div className="app-root">
      {/* Background animated elements */}
      <div className="music-background">
        <div className="note note1">♪</div>
        <div className="note note2">♫</div>
        <div className="note note3">🎵</div>
        <div className="note note4">♪</div>
        <div className="note note5">♫</div>

        {/* Sound waves */}
        <div className="sound-wave wave1"></div>
        <div className="sound-wave wave2"></div>
        <div className="sound-wave wave3"></div>

        {/* Frequency bars */}
        <div className="frequency-bar bar1"></div>
        <div className="frequency-bar bar2"></div>
        <div className="frequency-bar bar3"></div>
        <div className="frequency-bar bar4"></div>
        <div className="frequency-bar bar5"></div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div
            className="nav-brand"
            role="button"
            tabIndex={0}
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
            aria-label="Go to Home"
          >
            <span className="brand-icon">🎵</span>
            <h1>Music Mood Matcher</h1>
          </div>
          <div className="nav-menu">
            <button className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
              🏠 Home
            </button>
            <button className={`nav-btn ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
              ❤️ Favorites ({favorites.length})
            </button>
            <button className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
              📊 History
            </button>
            <button className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>
              ℹ️ About
            </button>
          </div>
        </div>
      </nav>

      {/* Home Tab */}
      {activeTab === 'home' && (
        <>
          <header className="app-header">
            <h2>Pick your mood and feel the rhythm 🎶</h2>
            <p className="subtitle">Explore curated songs in English, Hindi & Bengali</p>
          </header>

          <section className="moods">
            {moods.map((m, idx) => (
              <motion.button
                key={m}
                className={`mood-btn ${currentMood === m ? 'active' : ''}`}
                onClick={() => handleMoodClick(m)}
                title={`${m.charAt(0).toUpperCase() + m.slice(1)} mood`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mood-emoji">{moodEmojis[m]}</span>
                <span className="mood-name">{m}</span>
              </motion.button>
            ))}
          </section>

          {currentMood && (
            <div className="mood-controls">
              <label className="language-filter">
                Filter by language:
                <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                  <option value="all">All Languages</option>
                  <option value="English">🇬🇧 English</option>
                  <option value="Hindi">🇮🇳 Hindi</option>
                  <option value="Bengali">🇧🇩 Bengali</option>
                </select>
              </label>
              <span className="song-count">{getSongsByMood(currentMood).length} songs</span>
            </div>
          )}

          <main className="songs-area">
            {!currentMood && <p className="hint">🎧 Select a mood above to explore songs</p>}

            {currentMood && (
              <>
                <h2 className="mood-title">{moodEmojis[currentMood]} {currentMood.toUpperCase()} Vibes</h2>
                <div className="songs-grid">
                  {getSongsByMood(currentMood).map((s, i) => {
                    const id = `${currentMood}-${i}`
                    const isFav = favorites.some(f => f.id === id)
                    return (
                      <motion.div
                        className="song-card"
                        key={id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                      >
                        <div className={`heart ${isFav ? 'fav' : ''}`} onClick={() => toggleFavorite(id, { mood: currentMood, ...s })} title="Add to favorites">
                          {isFav ? '❤️' : '🤍'}
                        </div>
                        <div className="song-info">
                          <div className="song-title">{s.title}</div>
                          <div className="song-artist">{s.artist}</div>
                          <div className="song-language">{s.language}</div>
                        </div>
                        <a className="play-btn" href={s.url} target="_blank" rel="noreferrer" title="Play on YouTube">
                          ▶️ Play
                        </a>
                      </motion.div>
                    )
                  })}
                </div>
              </>
            )}
          </main>
        </>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <motion.div
          className="tab-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2>❤️ Your Favorite Songs</h2>
          {favorites.length === 0 && <p className="empty-state">No favorites yet. Add songs to your favorites!</p>}
          {favorites.length > 0 && (
            <>
              <p className="tab-subtitle">You have {favorites.length} favorite songs</p>
              <div className="songs-grid">
                {favorites.map((f, idx) => (
                  <motion.div
                    className="song-card"
                    key={f.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <div className="heart fav" onClick={() => toggleFavorite(f.id)} title="Remove from favorites">
                      ❤️
                    </div>
                    <div className="song-info">
                      <div className="song-title">{f.title}</div>
                      <div className="song-artist">{f.artist}</div>
                      <div className="song-language">{f.language}</div>
                    </div>
                    <a className="play-btn" href={f.url} target="_blank" rel="noreferrer">
                      ▶️ Play
                    </a>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* History / Stats Tab */}
      {activeTab === 'history' && (
        <motion.div
          className="tab-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2>📊 Mood Statistics</h2>
          {moodHistory.length === 0 && <p className="empty-state">No mood history yet. Start selecting moods!</p>}
          {moodHistory.length > 0 && (
            <>
              <p className="tab-subtitle">Summary of your recent mood selections</p>
              <div className="history-grid">
                {moods.map((m, idx) => {
                  const entries = moodHistory.filter(e => e.mood === m)
                  const count = entries.length
                  const last = count ? new Date(entries[entries.length - 1].timestamp).toLocaleString() : '—'
                  return (
                    <motion.div
                      className="history-card"
                      key={m}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                    >
                      <div className="history-emoji">{moodEmojis[m]}</div>
                      <div className="history-mood">{m.charAt(0).toUpperCase() + m.slice(1)}</div>
                      <div className="history-time">{count} selection{count !== 1 ? 's' : ''} • Last: {last}</div>
                    </motion.div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '1rem' }}>
                <button className="nav-btn" onClick={() => setMoodHistory([])}>Clear History</button>
                <button className="nav-btn" onClick={() => setActiveTab('home')}>Back Home</button>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <motion.div
          className="tab-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2>ℹ️ About Music Mood Matcher</h2>
          <div className="about-content">
            <p>
              🎵 <strong>Music Mood Matcher</strong> is your personal music companion that matches your mood with curated songs!
            </p>
            <h3>Features:</h3>
            <ul>
              <li>🎧 <strong>6 Moods:</strong> Happy, Sad, Energetic, Romantic, Chill, Angry</li>
              <li>🌍 <strong>Multi-language:</strong> English, Hindi & Bengali songs</li>
              <li>🎵 <strong>30+ songs per mood:</strong> Extensive music library</li>
              <li>❤️ <strong>Favorites:</strong> Save your favorite songs</li>
              <li>📊 <strong>History:</strong> Track your mood selections</li>
              <li>🎨 <strong>Beautiful UI:</strong> Music-themed design with animated elements</li>
            </ul>
            <h3>How to use:</h3>
            <ol>
              <li>Select a mood from the main page</li>
              <li>Filter by language if you prefer</li>
              <li>Click on any song to play it on YouTube</li>
              <li>Add songs to your favorites by clicking the heart icon</li>
              <li>Check your history and favorites anytime</li>
            </ol>
            <p className="footer-text">Made with 🎶 and ❤️ by Debasmita</p>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-main">🎵 Music Mood Matcher © 2025</p>
          <p className="footer-creators">Created with 💜 by <strong>Babin Bid</strong> & <strong>Debasmita Bose</strong></p>
        </div>
      </footer>
    </div>
  )
}

export default App
