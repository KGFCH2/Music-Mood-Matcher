import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { songs, moods } from './data/songs'
import Loader from './components/Loader'
import Login from './components/Login'
import { useAuth } from './context/AuthContext'
import CrushMode from './components/CrushMode'
import MoodWebcam from './components/MoodWebcam'
import ProfileNav from './components/ProfileNav'
import './App.css'

function App() {
  const { user, login, logout, updateUser, isLoading: authLoading } = useAuth()
  const [showLoader, setShowLoader] = useState(true)
  const [currentMood, setCurrentMood] = useState(null)
  const [activeTab, setActiveTab] = useState('home')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [favorites, setFavorites] = useState([])
  const [moodHistory, setMoodHistory] = useState([])
  const [showSecurityAlert, setShowSecurityAlert] = useState(false)
  const [showProfileNav, setShowProfileNav] = useState(false)

  // Show security alert when user logs in
  useEffect(() => {
    if (user?.userId) {
      setShowSecurityAlert(true)
      const timer = setTimeout(() => setShowSecurityAlert(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [user?.userId])

  // Load user-specific favorites when user changes
  useEffect(() => {
    if (user?.userId) {
      try {
        const userFavorites = JSON.parse(localStorage.getItem(`musicMoodFavorites-${user.userId}`) || '[]')
        setFavorites(userFavorites)
      } catch {
        setFavorites([])
      }
      // Reset to home tab when user changes
      setActiveTab('home')
      setCurrentMood(null)
    }
  }, [user?.userId])

  // Load user-specific history when user changes
  useEffect(() => {
    if (user?.userId) {
      try {
        const userHistory = JSON.parse(localStorage.getItem(`musicMoodHistory-${user.userId}`) || '[]')
        setMoodHistory(userHistory)
      } catch {
        setMoodHistory([])
      }
    }
  }, [user?.userId])

  // Save user-specific favorites
  useEffect(() => {
    if (user?.userId) {
      localStorage.setItem(`musicMoodFavorites-${user.userId}`, JSON.stringify(favorites))
    }
  }, [favorites, user?.userId])

  // Save user-specific history
  useEffect(() => {
    if (user?.userId) {
      localStorage.setItem(`musicMoodHistory-${user.userId}`, JSON.stringify(moodHistory))
    }
  }, [moodHistory, user?.userId])

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

  const getGenderAvatar = (gender) => {
    switch (gender) {
      case 'male':
        return '👨'
      case 'female':
        return '👩'
      case 'other':
        return '🧑'
      default:
        return '👤'
    }
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
    <>
      {(showLoader || authLoading) && <Loader onDone={() => {
        console.log('Loader done, hiding loader')
        setShowLoader(false)
      }} introDuration={800} />}
      {!showLoader && !authLoading ? (
        <>
          {!user ? (
            <Login onLoginSuccess={(userData) => {
              login(userData)
              setActiveTab('home')
              setCurrentMood(null)
            }} />
          ) : (
            <div className="app-root">
              {/* Profile Navigation Sidebar */}
              {showProfileNav && (
                <ProfileNav user={user} onClose={() => setShowProfileNav(false)} onUpdateUser={updateUser} />
              )}

              {/* Security Alert */}
              {showSecurityAlert && (
                <motion.div
                  className="security-alert"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="alert-background"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="alert-icon">🔒</span>
                    <span className="alert-text">Your data is securely stored in your browser</span>
                  </motion.div>
                </motion.div>
              )}

              {/* Background animated elements - Only music notes */}
              <div className="music-background">
                <div className="note note1">♪</div>
                <div className="note note2">♫</div>
                <div className="note note3">🎵</div>
                <div className="note note4">♪</div>
                <div className="note note5">♫</div>
              </div>

              {/* Navbar */}
              <nav className="navbar">
                <div className="nav-container">
                  <div
                    className="nav-brand"
                    role="button"
                    tabIndex={0}
                    onClick={() => { setActiveTab('home'); setCurrentMood(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setActiveTab('home'); setCurrentMood(null); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
                    aria-label="Go to Home"
                  >
                    <span className="brand-icon">🎵</span>
                    <h1>Music Mood Matcher</h1>
                  </div>
                  <div className="nav-menu">
                    <button className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => { setActiveTab('home'); setCurrentMood(null); }}>
                      🏠 Home
                    </button>
                    <button className={`nav-btn ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
                      ❤️ Favorites ({favorites.length})
                    </button>
                    <button className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                      📊 History
                    </button>
                    <button className={`nav-btn ${activeTab === 'ai-mood' ? 'active' : ''}`} onClick={() => setActiveTab('ai-mood')}>
                      🤖 AI Mood
                    </button>
                    <button className={`nav-btn ${activeTab === 'crush' ? 'active' : ''}`} onClick={() => setActiveTab('crush')}>
                      🕵️‍♂️ Crush Mode
                    </button>
                    <button className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>
                      ℹ️ About
                    </button>
                  </div>
                  <button className="logout-btn" onClick={logout} title="Logout">
                    <span className="logout-icon">👋</span>
                  </button>
                </div>
              </nav>

              {/* Floating Profile Button */}
              <motion.button
                className="floating-profile-btn"
                onClick={() => setShowProfileNav(true)}
                title="View Profile"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="floating-avatar">
                  <span className="floating-avatar-icon">{getGenderAvatar(user?.gender)}</span>
                </div>
              </motion.button>

              {/* Home Tab */}
              {activeTab === 'home' && (
                <>
                  <header className="app-header">
                    <h2>
                      <span className="header-emoji">🎶</span>
                      <span className="header-text">Pick your mood and feel the rhythm</span>
                    </h2>
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
                        <h2 className="mood-title">
                          <span className="mood-emoji-header">{moodEmojis[currentMood]}</span>
                          <span className="mood-text">{currentMood.toUpperCase()} Vibes</span>
                        </h2>
                        <div className="songs-grid">
                          {getSongsByMood(currentMood).map((s, i) => {
                            const id = `${currentMood}-${s.title}-${s.artist}-${s.language}`
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
                  <h2>
                    <span className="tab-emoji">❤️</span>
                    <span className="tab-text">Your Favorite Songs</span>
                  </h2>
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
                  <h2>
                    <span className="tab-emoji">📊</span>
                    <span className="tab-text">Mood Statistics</span>
                  </h2>
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

              {/* AI Mood Tab */}
              {activeTab === 'ai-mood' && (
                <div className="tab-content">
                  <h2>
                    <span className="tab-emoji">🤖</span>
                    <span className="tab-text">AI Mood Detection</span>
                  </h2>
                  <p className="tab-subtitle">Let your webcam detect your mood and generate a playlist! (No images are stored)</p>
                  <MoodWebcam />
                </div>
              )}

              {/* Crush Mode Tab */}
              {activeTab === 'crush' && (
                <motion.div
                  className="tab-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2>
                    <span className="tab-emoji">🕵️‍♂️</span>
                    <span className="tab-text">Crush Mode</span>
                  </h2>
                  <p className="tab-subtitle">Secret feature: Generate a playlist for your crush!</p>
                  <CrushMode />
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
                  <h2>
                    <span className="tab-emoji">ℹ️</span>
                    <span className="tab-text">About Music Mood Matcher</span>
                  </h2>
                  <div className="about-content">
                    <p>
                      🎵 <strong>Music Mood Matcher</strong> is your personal music companion that matches your mood with curated songs!
                    </p>
                    <h3>Features:</h3>
                    <ul>
                      <li><span className="feature-emoji">🎧</span><span className="feature-text"><strong>6 Moods:</strong> Happy, Sad, Energetic, Romantic, Chill, Angry</span></li>
                      <li><span className="feature-emoji">🌍</span><span className="feature-text"><strong>Multi-language:</strong> English, Hindi & Bengali songs</span></li>
                      <li><span className="feature-emoji">🎵</span><span className="feature-text"><strong>20+ songs per mood:</strong> Extensive music library</span></li>
                      <li><span className="feature-emoji">❤️</span><span className="feature-text"><strong>Favorites:</strong> Save your favorite songs</span></li>
                      <li><span className="feature-emoji">📊</span><span className="feature-text"><strong>History:</strong> Track your mood selections</span></li>
                      <li><span className="feature-emoji">🎨</span><span className="feature-text"><strong>Beautiful UI:</strong> Music-themed design with animated elements</span></li>
                    </ul>
                    <h3>How to use:</h3>
                    <ol>
                      <li>Select a mood from the main page</li>
                      <li>Filter by language if you prefer</li>
                      <li>Click on any song to play it on YouTube</li>
                      <li>Add songs to your favorites by clicking the heart icon</li>
                      <li>Check your history and favorites anytime</li>
                    </ol>
                    <p className="footer-text">
                      <span className="made-emoji">🎶</span>
                      <span className="made-text">Made with</span>
                      <span className="heart-emoji">❤️</span>
                      <span className="made-text">by Babin & Debasmita</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </>
      ) : (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          color: '#fff',
          fontSize: '1.5rem',
          zIndex: 1
        }}>
          Loading...
        </div>
      )}
    </>
  )
}

export default App
