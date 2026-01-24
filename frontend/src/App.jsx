import { useEffect, useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { FaHeadphones, FaRobot, FaHeart, FaGlobe, FaMusic, FaLock, FaHome, FaHistory } from 'react-icons/fa'
import { songs, moods } from './data/songs'
import Loader from './components/Loader'
import Login from './components/Login'
import { useAuth } from './context/AuthContext'
import ProfileNav from './components/ProfileNav'
import './App.css'

const typewriterExamples = [
  'Happy — Upbeat Pop & Indie',
  'Sad — Soulful Ballads & Piano',
  'Energetic — Electronic & Dance',
  'Romantic — Soft R&B & Acoustic',
  'Chill — Ambient, Lo-fi & Jazz',
  'Angry — Heavy Rock & Metal',
  'Music is the shorthand of emotion. — Leo Tolstoy',
  'Where words fail, music speaks. — Hans Christian Andersen',
  'Music can change the world because it can change people. — Bono',
]

const moodDetails = {
  happy: 'Major keys, bright instrumentation, faster tempos (120+ BPM). It triggers dopamine release, creating a sense of reward and joy.',
  sad: 'Minor keys, slower tempos (60-90 BPM), melancholic melodies. It allows for emotional release and can actually provide comfort through empathy.',
  energetic: 'High energy, strong beats, dynamic rhythms, synths & drums. It increases heart rate and adrenaline, perfect for motivation and focus.',
  romantic: 'Smooth vocals, warm harmonies, slower tempos, intimate acoustics. It fosters connection and releases oxytocin, the "love hormone".',
  chill: 'Minimalist arrangements, atmospheric textures, steady grooves. It lowers cortisol levels and helps synchronize brain waves for relaxation.',
  angry: 'Distortion, aggressive drums, heavy bass, intense vocals. It provides a safe outlet for intense emotions and can be cathartic.',
}

const moodMusicRelation = {
  happy: "Major keys + Fast Tempo = Joy",
  sad: "Minor keys + Slow Tempo = Reflection",
  energetic: "Heavy Bass + High BPM = Power",
  chill: "Soft Pads + Nature Sounds = Peace",
  romantic: "Strings + Gentle Vocals = Love",
  angry: "Distortion + Aggressive Beats = Release"
};

const moodTips = {
  happy: "Try singing along! It releases even more endorphins.",
  sad: "Don't skip the sad songs; they help you process and move on.",
  energetic: "Use this for your hardest tasks to maintain peak performance.",
  chill: "Perfect for deep work or winding down before sleep.",
  romantic: "Great for creating a shared emotional space with someone.",
  angry: "Let the music carry the weight of your frustration."
};

const MoodWebcam = lazy(() => import('./components/MoodWebcam'))

const musicFacts = [
  "Listening to music while exercising can improve your performance by 15%.",
  "Your heartbeat changes and mimics the music you listen to.",
  "The 'Mozart Effect' suggests that listening to classical music can temporarily boost IQ.",
  "Music is one of the few activities that involves using the whole brain.",
  "An average person listens to about 18 hours of music per week.",
  "Flowers can grow faster if you play music around them."
];

const musicImages = [
  'https://images.squarespace-cdn.com/content/v1/58125982e58c62bc08948096/1502130562840-XIPRQ7TNS7VUH25ZGLF6/image-asset.jpeg',
  'https://www.beatoven.ai/blog/wp-content/uploads/2024/11/20241115-125147-768x768.jpeg',
  'https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/6746ec796cc045001dc39b5a.jpg',
  'https://live-production.wcms.abc-cdn.net.au/a362273509f7eccdcf362bb73b3b006d?impolicy=wcms_crop_resize&cropH=788&cropW=1400&xPos=0&yPos=0&width=862&height=485',
  'https://img.freepik.com/free-photo/3d-music-related-scene_23-2151124956.jpg?t=st=1769270576~exp=1769274176~hmac=96882f278d6c39641178ddf8021c2bd86791a3173d99842e9ab53011ab3b17d6',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  'https://img.freepik.com/premium-photo/glowing-neon-lines-tunnel-3d-rendering_778569-3582.jpg?semt=ais_user_personalization&w=740&q=80',
  'https://www.wipo.int/documents/102028/103632/creative+industries-blog-music-sampling-960.jpg'
]

function App() {
  const { user, login, logout, updateUser, isLoading: authLoading } = useAuth()
  const [showLoader, setShowLoader] = useState(true)
  const [currentMood, setCurrentMood] = useState(null)
  const [activeTab, setActiveTab] = useState('home')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [favorites, setFavorites] = useState([])
  const [moodHistory, setMoodHistory] = useState([])
  const [showProfileNav, setShowProfileNav] = useState(false)
  const [openProfileEdit, setOpenProfileEdit] = useState(false)
  const [randomFact, setRandomFact] = useState('')

  const [titleHover, setTitleHover] = useState(false)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    setRandomFact(musicFacts[Math.floor(Math.random() * musicFacts.length)])
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % musicImages.length)
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [])

  const [typeText, setTypeText] = useState('')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    let timeout = null
    const current = typewriterExamples[exampleIndex]

    if (charIndex <= current.length) {
      timeout = setTimeout(() => {
        setTypeText(current.slice(0, charIndex))
        setCharIndex((i) => i + 1)
      }, 80)
    } else {
      timeout = setTimeout(() => {
        setTypeText('')
        setCharIndex(0)
        setExampleIndex((i) => (i + 1) % typewriterExamples.length)
      }, 1500) // pause before next example
    }

    return () => clearTimeout(timeout)
  }, [charIndex, exampleIndex])

  useEffect(() => {
    if (user?.userId) {
      try {
        const userFavorites = JSON.parse(localStorage.getItem(`musicMoodFavorites-${user.userId}`) || '[]')
        setFavorites(userFavorites)
      } catch {
        setFavorites([])
      }
      setActiveTab('home')
      setCurrentMood(null)
    }
  }, [user?.userId])

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

  useEffect(() => {
    if (user?.userId) {
      localStorage.setItem(`musicMoodFavorites-${user.userId}`, JSON.stringify(favorites))
    }
  }, [favorites, user?.userId])

  useEffect(() => {
    if (user?.userId) {
      localStorage.setItem(`musicMoodHistory-${user.userId}`, JSON.stringify(moodHistory))
    }
  }, [moodHistory, user?.userId])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

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
    happy: '🤠',
    sad: '🥺',
    energetic: '🥳',
    romantic: '🥰',
    chill: '😎',
    angry: '😤'
  }

  const getGenderAvatar = (gender) => {
    switch (gender) {
      case 'male':
        return '👨'
      case 'female':
        return '👩'
      case 'other':
        return '👤' // use classic neutral silhouette for 'other'
      default:
        return '🧑' // default to neutral avatar
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
  }, [currentMood, moodColors])

  return (
    <>
      {(showLoader || authLoading) && <Loader onDone={() => {
        setShowLoader(false)
      }} introDuration={800} />}
      {!showLoader && !authLoading ? (
        <>
          {!user ? (
            <Login onLoginSuccess={(userData, options) => {
              login(userData)
              setActiveTab('home')
              setCurrentMood(null)
              if (options && options.openProfile) {
                setOpenProfileEdit(true)
                setShowProfileNav(true)
              }
            }} />
          ) : (
            <div className="app-root music-hacker">
              {/* Profile Navigation Sidebar */}
              {showProfileNav && (
                <ProfileNav
                  user={user}
                  openInEdit={openProfileEdit}
                  onClose={() => { setShowProfileNav(false); setOpenProfileEdit(false) }}
                  onUpdateUser={updateUser}
                  onLogout={() => {
                    logout()
                    setShowProfileNav(false)
                    setOpenProfileEdit(false)
                  }}
                />
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
                      <FaHome className="nav-icon" />
                      <span className="nav-text">Home</span>
                    </button>
                    <button className={`nav-btn ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
                      <FaHeart className="nav-icon" />
                      <span className="nav-text">Favorites ({favorites.length})</span>
                    </button>
                    <button className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                      <FaHistory className="nav-icon" />
                      <span className="nav-text">History</span>
                    </button>
                    <button className={`nav-btn ${activeTab === 'ai-mood' ? 'active' : ''}`} onClick={() => setActiveTab('ai-mood')}>
                      <FaRobot className="nav-icon" />
                      <span className="nav-text">AI Mood</span>
                    </button>
                    {/* Crush Mode removed */}
                  </div>
                  <button className="logout-btn" onClick={logout} title="Logout">
                    <span className="logout-icon">👋</span>
                  </button>
                </div>
              </nav>

              {/* Floating Profile Button */}
              {!showProfileNav && (
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
              )}

              {/* Home Tab */}
              {activeTab === 'home' && (
                <>
                  <div className="home-details-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
                    {/* Hero Section with Context */}
                    <div style={{ textAlign: 'center', padding: '1.5rem 2rem', marginBottom: '2rem' }}>
                      <h1 className="home-hero-title aurora-text" onMouseEnter={() => setTitleHover(true)} onMouseLeave={() => setTitleHover(false)} style={{ transform: titleHover ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.3s ease' }}>🎵 Music Mood Matcher 🎵</h1>
                      <p className="home-hero-subtitle">
                        Discover the perfect music for your mood. Select how you feel or let our AI detect your emotion, and we'll suggest songs tailored just for you.
                      </p>

                      {/* Image Carousel */}
                      <div className="image-carousel">
                        <div className="carousel-container">
                          <img
                            key={currentImageIndex}
                            src={musicImages[currentImageIndex]}
                            alt="Music visualization"
                            className="carousel-image"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* Typewriter Section */}
                      <h2 className="typewriter-label">Did you know?</h2>
                      <div className="typewriter-container">
                        <span className="typewriter-text">{typeText}</span>
                        <span className="typewriter-cursor">▌</span>
                      </div>
                    </div>

                    {/* Beauty Cards Grid */}
                    <div className="beauty-grid">
                      <motion.div
                        className="beauty-card music-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <FaHeadphones className="beauty-icon" />
                        <h3>Discover Music</h3>
                        <p>Select a mood and find songs that match your vibe</p>
                      </motion.div>

                      <motion.div
                        className="beauty-card ai-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                      >
                        <FaRobot className="beauty-icon" />
                        <h3>AI Detection</h3>
                        <p>Let your webcam detect your mood automatically</p>
                      </motion.div>

                      <motion.div
                        className="beauty-card heart-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                      >
                        <FaHeart className="beauty-icon" />
                        <h3>Save Favorites</h3>
                        <p>Build your personal music collection</p>
                      </motion.div>

                      <motion.div
                        className="beauty-card globe-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                      >
                        <FaGlobe className="beauty-icon" />
                        <h3>3 Languages</h3>
                        <p>English, Hindi & Bengali songs available</p>
                      </motion.div>

                      <motion.div
                        className="beauty-card playlist-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                      >
                        <FaMusic className="beauty-icon" />
                        <h3>Perfect Playlists</h3>
                        <p>Curated songs for every emotional state</p>
                      </motion.div>

                      <motion.div
                        className="beauty-card lock-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <FaLock className="beauty-icon" />
                        <h3>Private & Fast</h3>
                        <p>Your data stays on your device, always</p>
                      </motion.div>
                    </div>
                  </div>

                  <div className="mood-selection-header" style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '2rem' }}>
                    <h2 className="aurora-text-2" style={{ fontSize: '2.2rem' }}>
                      <img src="https://cdn-icons-png.flaticon.com/128/10190/10190892.png" alt="music icon" style={{ width: '24px', height: '24px', marginRight: '8px' }} /> Select Your Current Mood <img src="https://cdn-icons-png.flaticon.com/128/10190/10190892.png" alt="music icon" style={{ width: '24px', height: '24px', marginLeft: '8px' }} />
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>🔥 Choose a vibe to get personalized song recommendations 🔥</p>
                  </div>

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
                        <span className="mood-emoji emoji-pop">{moodEmojis[m]}</span>
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
                    {!currentMood && <p className="hint aurora-text-2">🎧 Select a mood above to explore songs 🎧</p>}

                    {currentMood && (
                      <>
                        <h2 className="mood-title">
                          <span className="mood-emoji-header emoji-pop">{moodEmojis[currentMood]}</span>
                          <span className="mood-text">{currentMood.toUpperCase()} Vibes</span>
                          <span className="mood-emoji-header emoji-pop">{moodEmojis[currentMood]}</span>
                        </h2>
                        <p className="mood-description-text">
                          {moodDetails[currentMood]}
                        </p>
                        <div className="mood-insight-badge">
                          <span className="insight-icon">💡</span>
                          <span className="insight-text">{moodTips[currentMood]}</span>
                        </div>
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
                    <span className="tab-emoji emoji-pop emoji-favorites">❤️</span>
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
                    <span className="tab-emoji emoji-pop emoji-stats">📊</span>
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
                    <span className="tab-emoji emoji-pop emoji-ai">🤖</span>
                    <span className="tab-text">AI Mood Detection</span>
                  </h2>
                  <p className="tab-subtitle">Let your webcam detect your mood and generate a playlist! (No images are stored)</p>
                  <Suspense fallback={<Loader />}>
                    <MoodWebcam />
                  </Suspense>
                </div>
              )}

              {/* Crush Mode removed */}

              {/* About Tab */}
              {activeTab === 'about' && (
                <motion.div
                  className="tab-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div></div> {/* spacer */}
                    <h2>
                      <span className="tab-emoji emoji-pop emoji-about">ℹ️</span>
                      <span className="tab-text">About Music Mood Matcher</span>
                      <span className="tab-emoji emoji-pop emoji-about">ℹ️</span>
                    </h2>
                    <button className="back-btn" onClick={() => setActiveTab('home')} title="Back to Home">
                      <span className="back-icon">⬅️</span>
                    </button>
                  </div>
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
                  </div>
                  <div className="page-footer">
                    <div className="footer-divider"></div>
                    <div className="footer-nav">
                      <button className="footer-nav-btn" onClick={() => setActiveTab('privacy')}><span className="emoji-pop emoji-privacy">🔒</span> <span>Privacy Policy</span></button>
                      <button className="footer-nav-btn" onClick={() => setActiveTab('terms')}><span className="emoji-pop emoji-terms">📋</span> <span>Terms of Service</span></button>
                      <button className="footer-nav-btn" onClick={() => setActiveTab('faq')}><span className="emoji-pop emoji-faq">❓</span> <span>FAQ</span></button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Privacy Policy Tab */}
              {activeTab === 'privacy' && (
                <motion.div
                  className="tab-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div></div> {/* spacer */}
                    <h2>
                      <span className="tab-emoji emoji-pop emoji-privacy">🔒</span>
                      <span className="tab-text">Privacy Policy</span>
                      <span className="tab-emoji emoji-pop emoji-privacy">🔒</span>
                    </h2>
                    <button className="back-btn" onClick={() => setActiveTab('home')} title="Back to Home">
                      <span className="back-icon">⬅️</span>
                    </button>
                  </div>
                  <div className="about-content">
                    <p><strong>Last Updated: December 2026</strong></p>

                    <h3>1. Introduction</h3>
                    <p>Music Mood Matcher ("we," "us," or "our") operates the Music Mood Matcher application. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>

                    <h3>2. Information We Collect</h3>
                    <p><strong>Personal Information:</strong></p>
                    <ul>
                      <li>Name and email address (for account registration)</li>
                      <li>Gender (optional, for personalization)</li>
                      <li>Mood selection history (stored locally)</li>
                      <li>Favorite songs list (stored locally)</li>
                    </ul>
                    <p><strong>Automatic Information:</strong></p>
                    <ul>
                      <li>Browser type and version</li>
                      <li>IP address (for security purposes)</li>
                      <li>Pages visited and time spent on app</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>

                    <h3>3. How We Use Your Information</h3>
                    <ul>
                      <li>To provide and maintain our service</li>
                      <li>To personalize your experience with mood-based recommendations</li>
                      <li>To track user analytics and improve the app</li>
                      <li>To respond to your inquiries and support requests</li>
                      <li>To maintain security and prevent fraudulent activities</li>
                    </ul>

                    <h3>4. Data Storage & Security</h3>
                    <p>Your mood history and favorites are primarily stored locally in your browser using localStorage. This means your data stays on your device. We implement industry-standard security measures including SSL encryption for transmitted data. However, no method of transmission over the Internet is 100% secure.</p>

                    <h3>5. Third-Party Services</h3>
                    <p>We use YouTube for song playback and Google Analytics for app analytics. These third parties have their own privacy policies and data handling practices. We recommend reviewing their policies as well.</p>

                    <h3>6. Your Rights</h3>
                    <ul>
                      <li><strong>Access:</strong> You can request access to the personal data we hold about you</li>
                      <li><strong>Deletion:</strong> You can request deletion of your account and associated data</li>
                      <li><strong>Portability:</strong> You can export your data in a machine-readable format</li>
                      <li><strong>Opt-out:</strong> You can disable cookies in your browser settings</li>
                    </ul>

                    <h3>7. Contact Us</h3>
                    <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:babinbid05@gmail.com">babinbid05@gmail.com</a> / <a href="mailto:dbose272@gmail.com">dbose272@gmail.com</a></p>
                  </div>
                  <div className="page-footer">
                    <div className="footer-divider"></div>
                    <div className="footer-nav">
                      <button className="footer-nav-btn" onClick={() => setActiveTab('terms')}>📋 Terms of Service</button>
                      <button className="footer-nav-btn" onClick={() => setActiveTab('faq')}>❓ FAQ</button>
                      <button className="footer-nav-btn" onClick={() => setActiveTab('about')}>ℹ️ About</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Terms of Service Tab */}
              {activeTab === 'terms' && (
                <motion.div
                  className="tab-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div></div> {/* spacer */}
                    <h2>
                      <span className="tab-emoji emoji-pop emoji-terms">📋</span>
                      <span className="tab-text">Terms of Service</span>
                      <span className="tab-emoji emoji-pop emoji-terms">📋</span>
                    </h2>
                    <button className="back-btn" onClick={() => setActiveTab('home')} title="Back to Home">
                      <span className="back-icon">⬅️</span>
                    </button>
                  </div>
                  <div className="about-content">
                    <p><strong>Last Updated: December 2025</strong></p>

                    <h3>1. Agreement to Terms</h3>
                    <p>By accessing and using Music Mood Matcher, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>

                    <h3>2. Use License</h3>
                    <p>Permission is granted to temporarily download one copy of the materials (information or software) on Music Mood Matcher for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                    <ul>
                      <li>Modify or copy the materials</li>
                      <li>Use the materials for any commercial purpose or for any public display</li>
                      <li>Attempt to decompile or reverse engineer any software contained on the app</li>
                      <li>Remove any copyright or other proprietary notations from the materials</li>
                      <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                      <li>Violate any applicable laws or regulations related to access to the app</li>
                    </ul>

                    <h3>3. Disclaimer</h3>
                    <p>The materials on Music Mood Matcher are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

                    <h3>4. Limitations</h3>
                    <p>In no event shall Music Mood Matcher or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the app, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>

                    <h3>5. Accuracy of Materials</h3>
                    <p>The materials appearing on Music Mood Matcher could include technical, typographical, or photographic errors. We do not warrant that any of the materials on the app are accurate, complete, or current. We may make changes to the materials contained on the app at any time without notice.</p>

                    <h3>6. Links</h3>
                    <p>We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.</p>

                    <h3>7. Modifications</h3>
                    <p>We may revise these terms of service for the app at any time without notice. By using the app, you are agreeing to be bound by the then current version of these terms of service.</p>

                    <h3>8. Governing Law</h3>
                    <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>

                    <h3>9. Contact</h3>
                    <p>If you have any questions about these Terms of Service, please contact us at: <a href="mailto:babinbid05@gmail.com">babinbid05@gmail.com</a> / <a href="mailto:dbose272@gmail.com">dbose272@gmail.com</a></p>
                  </div>
                  <div className="page-footer">
                    <div className="footer-divider"></div>
                    <div className="footer-nav">
                      <button className="footer-nav-btn" onClick={() => setActiveTab('privacy')}>🔒 Privacy Policy</button>
                      <button className="footer-nav-btn" onClick={() => setActiveTab('faq')}>❓ FAQ</button>
                      <button className="footer-nav-btn" onClick={() => setActiveTab('about')}>ℹ️ About</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* FAQ Tab */}
              {activeTab === 'faq' && (
                <motion.div
                  className="tab-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div></div> {/* spacer */}
                    <h2>
                      <span className="tab-emoji emoji-pop emoji-faq">❓</span>
                      <span className="tab-text">Frequently Asked Questions</span>
                      <span className="tab-emoji emoji-pop emoji-faq">❓</span>
                    </h2>
                    <button className="back-btn" onClick={() => setActiveTab('home')} title="Back to Home">
                      <span className="back-icon">⬅️</span>
                    </button>
                  </div>
                  <div className="about-content">

                    <h3>General Questions</h3>

                    <h4>What is Music Mood Matcher?</h4>
                    <p>Music Mood Matcher is a web application that recommends songs based on your current mood. Select one of six moods (Happy, Sad, Energetic, Romantic, Chill, Angry) and discover curated playlists in English, Hindi, and Bengali.</p>

                    <h4>Is Music Mood Matcher free to use?</h4>
                    <p>Yes! Music Mood Matcher is completely free. We don't charge any subscription fees. You can enjoy unlimited mood-based music recommendations without any cost.</p>

                    <h4>Do I need to create an account?</h4>
                    <p>Yes, you need to sign up with your name, email, and optional gender information. Your account helps us save your favorites and mood history so you can pick up where you left off.</p>

                    <h4>What moods are available?</h4>
                    <p>We offer six moods: Happy, Sad, Energetic, Romantic, Chill, and Angry. Each mood has a curated selection of songs designed to match that emotional state.</p>

                    <h3>Features & Functionality</h3>

                    <h4>How do I save my favorite songs?</h4>
                    <p>Click the heart icon (❤️) on any song card to add it to your favorites. You can view all saved favorites in the "Favorites" tab. Your favorites are saved locally in your browser.</p>

                    <h4>Can I filter songs by language?</h4>
                    <p>Yes! Once you select a mood, use the "Filter by language" dropdown to choose English, Hindi, Bengali, or view all languages together.</p>

                    <h4>Where do the songs play from?</h4>
                    <p>Clicking the "Play" button on any song opens it directly on YouTube. We partner with YouTube to provide you with seamless music playback.</p>

                    {/* Crush Mode info removed */}

                    <h4>How does the AI Mood feature work?</h4>
                    <p>The AI Mood feature uses your device's webcam to detect your facial expression and automatically recommend songs that match your detected emotion. It's fun and completely optional!</p>

                    <h3>Data & Privacy</h3>

                    <h4>Is my data safe?</h4>
                    <p>Yes! Your mood history and favorites are stored locally on your device using your browser's localStorage. We also use SSL encryption for any data transmitted to our servers. For details, see our Privacy Policy.</p>

                    <h4>What data do you collect?</h4>
                    <p>We collect your name, email, and optional gender for account purposes. Your mood selections and favorite songs are stored locally on your device. We use basic analytics to understand app usage but don't track personal behavior.</p>

                    <h4>Can I delete my account and data?</h4>
                    <p>Yes! You can request account deletion anytime. To delete your account, use the profile settings or contact support. Your local data can be cleared by clearing your browser's cache.</p>

                    <h4>Do you sell my data?</h4>
                    <p>Absolutely not. We never sell, rent, or share your personal information with third parties. Your data is yours alone.</p>

                    <h3>Technical Questions</h3>

                    <h4>What browsers does Music Mood Matcher support?</h4>
                    <p>Music Mood Matcher works on all modern browsers: Chrome, Firefox, Safari, Edge, and Opera. We recommend keeping your browser updated for the best experience.</p>

                    <h4>Can I use Music Mood Matcher on mobile?</h4>
                    <p>Yes! Music Mood Matcher is fully responsive and works great on smartphones, tablets, and desktops. Simply open it in your mobile browser.</p>

                    <h4>Why isn't the app loading?</h4>
                    <p>Try refreshing the page or clearing your browser cache. If issues persist, make sure JavaScript is enabled and you're using a supported browser. Contact support if problems continue.</p>

                    <h4>What should I do if I encounter a bug?</h4>
                    <p>We'd love to hear about it! Please report any bugs to: <a href="mailto:babinbid05@gmail.com">babinbid05@gmail.com</a> / <a href="mailto:dbose272@gmail.com">dbose272@gmail.com</a> with a description of the issue and screenshots if possible.</p>

                    <h3>Music & Content</h3>

                    <h4>How often are new songs added?</h4>
                    <p>We regularly update our music library with new recommendations. Follow us on social media or check the app for announcements about new additions!</p>

                    <h4>Can I suggest songs for a specific mood?</h4>
                    <p>Yes! We'd love your suggestions. Send your recommendations to: <a href="mailto:babinbid05@gmail.com">babinbid05@gmail.com</a> / <a href="mailto:dbose272@gmail.com">dbose272@gmail.com</a>. Your input helps us improve our music curation.</p>

                    <h4>Why is a particular song in a certain mood category?</h4>
                    <p>Songs are categorized based on their musical characteristics (tempo, key, instrumentation, lyrics) and the emotions they evoke. Our curation is based on music theory and user feedback.</p>

                    <h4>Can I download songs for offline listening?</h4>
                    <p>Music Mood Matcher requires an internet connection to stream songs via YouTube. However, you can create a playlist on YouTube itself for offline downloads through their premium service.</p>

                    <h3>Still Have Questions?</h3>

                    <p><strong>Contact us:</strong> <a href="mailto:babinbid05@gmail.com">babinbid05@gmail.com</a> / <a href="mailto:dbose272@gmail.com">dbose272@gmail.com</a></p>
                    <p><strong>Email:</strong> <a href="mailto:babinbid05@gmail.com">babinbid05@gmail.com</a> / <a href="mailto:dbose272@gmail.com">dbose272@gmail.com</a></p>
                    <p>We're here to help! Response time is typically within 24-48 hours.</p>
                  </div>
                  <div className="page-footer">
                    <div className="footer-divider"></div>
                    <div className="footer-nav">
                      <button className="footer-nav-btn" onClick={() => setActiveTab('privacy')}>🔒 Privacy Policy</button>
                      <button className="footer-nav-btn" onClick={() => setActiveTab('terms')}>📋 Terms of Service</button>
                      <button className="footer-nav-btn" onClick={() => setActiveTab('about')}>ℹ️ About</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Footer Section */}
              <footer className="footer">
                <div className="footer-content">
                  <p className="footer-creators">
                    Made with <span className="heart-emoji">❤️</span> by <span className="aurora-text-3">Babin</span> &amp; <span className="aurora-text-3">Debasmita</span>
                  </p>
                  <div className="footer-links">
                    <span
                      className="footer-link"
                      onClick={() => setActiveTab('privacy')}
                      title="Read our Privacy Policy"
                    >
                      🔒 Privacy Policy
                    </span>
                    <span
                      className="footer-link"
                      onClick={() => setActiveTab('terms')}
                      title="Read our Terms of Service"
                    >
                      📋 Terms of Service
                    </span>
                    <span
                      className="footer-link"
                      onClick={() => setActiveTab('faq')}
                      title="Read FAQs"
                    >
                      ❓ FAQ
                    </span>
                    <span
                      className="footer-link"
                      onClick={() => setActiveTab('about')}
                      title="Learn About Music Mood Matcher"
                    >
                      ℹ️ About
                    </span>
                  </div>
                </div>
                <p className="footer-copyright">© 2026 Music Mood Matcher. All rights reserved.</p>
              </footer>
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
          <div style={{ textAlign: 'center' }}>
            <h2>Debug Info</h2>
            <p>showLoader: {showLoader ? 'true' : 'false'}</p>
            <p>authLoading: {authLoading ? 'true' : 'false'}</p>
            <p>user: {user ? 'logged in' : 'null'}</p>
            <p>user details: {user ? JSON.stringify(user, null, 2) : 'N/A'}</p>
            <button onClick={() => {
            }}>Log Debug Info</button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
