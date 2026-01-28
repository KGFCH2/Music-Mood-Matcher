import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './tabs.css'

// Typewriter effect for music ↔ mood examples
const examples = [
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

const musicImages = [
  'https://images.squarespace-cdn.com/content/v1/58125982e58c62bc08948096/1502130562840-XIPRQ7TNS7VUH25ZGLF6/image-asset.jpeg',
  'https://www.beatoven.ai/blog/wp-content/uploads/2024/11/20241115-125147-768x768.jpeg',
  'https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/6746ec796cc045001dc39b5a.jpg',
  'https://live-production.wcms.abc-cdn.net.au/a362273509f7eccdcf362bb73b3b006d?impolicy=wcms_crop_resize&cropH=788&cropW=1400&xPos=0&yPos=0&width=862&height=485',
  'https://img.freepik.com/free-photo/3d-music-related-scene_23-2151124956.jpg?t=st=1769270576~exp=1769274176~hmac=96882f278d6c39641178ddf8021c2bd86791a3173d99842e9ab53011ab3b17d6',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  'https://img.freepik.com/premium-photo/glowing-neon-lines-tunnel-3d-rendering_778569-3582.jpg?semt=ais_user_personalization&w=740&q=80',
  'https://www.wipo.int/documents/102028/103632/creative+industries-blog-music-sampling-960.jpg',
  'https://valleycultural.org/wp-content/uploads/2021/07/Music-scaled.jpg', 
  'https://img.freepik.com/free-vector/musical-notes-frame-with-text-space_1017-32857.jpg?semt=ais_hybrid&w=740&q=80', 
  'https://theschoolpost.in/wp-content/uploads/2025/07/675ec84d8fd4ab001d0c64f2.jpg', 
  'https://img.freepik.com/premium-photo/gold-music-background-with-musical-notes-bokeh-lights_769928-2100.jpg', 
  'https://img.freepik.com/premium-photo/music-notes-colorful-background_1236215-14599.jpg', 
  'https://static.vecteezy.com/system/resources/thumbnails/047/918/672/small/music-abstract-with-headphones-horizontal-wallpaper-photo.jpg'
]

const moodDetails = {
    happy: 'Major keys, bright instrumentation, faster tempos (120+ BPM). It triggers dopamine release, creating a sense of reward and joy.',
    sad: 'Minor keys, slower tempos (60-90 BPM), melancholic melodies. It allows for emotional release and can actually provide comfort through empathy.',
    energetic: 'High energy, strong beats, dynamic rhythms, synths & drums. It increases heart rate and adrenaline, perfect for motivation and focus.',
    romantic: 'Smooth vocals, warm harmonies, slower tempos, intimate acoustics. It fosters connection and releases oxytocin, the "love hormone".',
    chill: 'Minimalist arrangements, atmospheric textures, steady grooves. It lowers cortisol levels and helps synchronize brain waves for relaxation.',
    angry: 'Distortion, aggressive drums, heavy bass, intense vocals. It provides a safe outlet for intense emotions and can be cathartic.',
}

export default function HomeTab({ songs, onMoodSelect, currentMood }) {
    const [hoveredMood, setHoveredMood] = useState(null)
    const [hoveredSong, setHoveredSong] = useState(null)

    const moodEmojis = {
        happy: '😊',
        sad: '😢',
        energetic: '⚡',
        romantic: '💕',
        chill: '😎',
        angry: '😠',
    }

    const moodColors = {
        happy: '#FFD700',
        sad: '#4B0082',
        energetic: '#FF4500',
        romantic: '#FF1493',
        chill: '#87CEEB',
        angry: '#DC143C',
    }

    const moodHoverColors = {
        happy: 'rgba(255, 215, 0, 0.2)',
        sad: 'rgba(75, 0, 130, 0.2)',
        energetic: 'rgba(255, 69, 0, 0.2)',
        romantic: 'rgba(255, 20, 147, 0.2)',
        chill: 'rgba(135, 206, 235, 0.2)',
        angry: 'rgba(220, 20, 60, 0.2)',
    }

    const moodActiveColors = {
        happy: 'rgba(255, 215, 0, 0.4)',
        sad: 'rgba(75, 0, 130, 0.4)',
        energetic: 'rgba(255, 69, 0, 0.4)',
        romantic: 'rgba(255, 20, 147, 0.4)',
        chill: 'rgba(135, 206, 235, 0.4)',
        angry: 'rgba(220, 20, 60, 0.4)',
    }

    const moods = Object.keys(moodEmojis)

    const [typeText, setTypeText] = useState('')
    const [exampleIndex, setExampleIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)

    useEffect(() => {
        let timeout = null
        const current = examples[exampleIndex]

        if (charIndex <= current.length) {
            timeout = setTimeout(() => {
                setTypeText(current.slice(0, charIndex))
                setCharIndex((i) => i + 1)
            }, 80)
        } else {
            // Pause after typing full text, then move to next
            timeout = setTimeout(() => {
                setTypeText('')
                setCharIndex(0)
                setExampleIndex((i) => (i + 1) % examples.length)
            }, 1500) // Longer pause between examples
        }

        return () => clearTimeout(timeout)
    }, [charIndex, exampleIndex])

    return (
        <div className="tab-container">
            <h2 className="tab-title">What's Your Mood?</h2>
            <p className="tab-subtitle">Select a mood to get personalized song recommendations</p>

            <div className="music-marquee">
                <div className="marquee-content">
                    {/* Double the images for seamless loop */}
                    {[...musicImages, ...musicImages].map((img, index) => (
                        <div key={index} className="marquee-image-container">
                            <img src={img} alt={`Music ${index}`} className="marquee-image" loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>

            <section aria-labelledby="home-intro" className="tab-section">
                <h3 id="home-intro" className="section-heading">Find music that fits your moment</h3>
                <p className="section-text">Music Mood Matcher suggests songs based on your current mood — detected automatically via webcam or selected by you. Fast, private, and tailored playlists help you focus, relax, or celebrate.</p>

                <ul className="features-list" aria-label="Key features">
                    <li className="feature-item">Personalized playlists curated per mood</li>
                    <li className="feature-item">Quick mood detection via webcam (optional)</li>
                    <li className="feature-item">Save favorites and revisit your listening history</li>
                </ul>

                <div className="how-it-works">
                    <h4 className="how-title">How it works</h4>
                    <ol className="how-steps">
                        <li className="how-step"><strong>Choose a mood</strong> — tap an emoji or use the webcam to detect your expression.</li>
                        <li className="how-step"><strong>Get recommendations</strong> — see a curated playlist instantly and play previews.</li>
                        <li className="how-step"><strong>Save & enjoy</strong> — add songs to favorites or explore similar tracks.</li>
                    </ol>
                </div>
            </section>

            <section aria-labelledby="music-mood" className="tab-section">
                <h3 id="music-mood" className="section-heading">🎵 Music & Mood: The Connection</h3>
                <p className="section-text">
                    Music and emotion are deeply intertwined. Research shows that listening to music activates the same
                    reward centers in your brain as food or drugs. Tempo, key, and instrumentation directly influence how you feel:
                </p>

                <ul className="music-facts-list" aria-label="How music affects mood">
                    <li className="music-fact"><strong>Tempo:</strong> Faster beats elevate energy; slower tempos calm and relax.</li>
                    <li className="music-fact"><strong>Key:</strong> Major keys sound happy and bright; minor keys feel introspective and sad.</li>
                    <li className="music-fact"><strong>Instrumentation:</strong> Strings are intimate; synths are modern; drums drive intensity.</li>
                    <li className="music-fact"><strong>Harmony:</strong> Consonance feels pleasant; dissonance can evoke tension or excitement.</li>
                </ul>

                <div className="typewriter-label">Pick your mood, see the musical blueprint:</div>
                <div aria-live="polite" className="typewriter-container">
                    <span className="typewriter-text">{typeText}</span>
                    <span className="typewriter-cursor" aria-hidden>▌</span>
                </div>

                <p className="section-text-end">
                    Every mood deserves the perfect soundtrack. Let our AI-powered matching find songs that resonate with
                    how you're feeling right now.
                </p>
            </section>

            <section aria-labelledby="psychology-sound" className="tab-section">
                <h3 id="psychology-sound" className="section-heading">🧠 The Psychology of Sound</h3>
                <p className="section-text">
                    Did you know that your brain processes music in the same areas that handle basic emotions?
                    This is why a single chord can make you feel nostalgic, or a driving beat can instantly boost your confidence.
                    Music isn't just something we hear; it's something we <em>feel</em>.
                </p>
                <div className="did-you-know">
                    <span className="did-you-know-title">Did You Know?</span>
                    <p className="did-you-know-text">
                        Listening to your favorite music can reduce anxiety by up to 65% and increase productivity by 15%.
                        It's a powerful tool for mental well-being.
                    </p>
                </div>
            </section>

            <div className="mood-grid">
                {moods.map((mood) => (
                    <button
                        key={mood}
                        onClick={() => onMoodSelect(mood)}
                        onMouseEnter={() => setHoveredMood(mood)}
                        onMouseLeave={() => setHoveredMood(null)}
                        className={`mood-button ${currentMood === mood ? 'active' : ''}`}
                        style={{
                            borderColor: moodColors[mood],
                            backgroundColor: currentMood === mood ? moodActiveColors[mood] : hoveredMood === mood ? moodHoverColors[mood] : 'transparent',
                        }}
                    >
                        <span className="mood-emoji" style={{ transform: hoveredMood === mood ? 'scale(1.3)' : 'scale(1)' }}>{moodEmojis[mood]}</span>
                        <span className="mood-label">{mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
                    </button>
                ))}
            </div>

            {currentMood && (
                <div className="playlist-container">
                    <h3 className="playlist-title">🎵 Your {currentMood.toUpperCase()} Playlist</h3>
                    <p className="mood-detail-text">{moodDetails[currentMood]}</p>
                    <div className="song-list">
                        {songs[currentMood]?.slice(0, 10).map((song, idx) => (
                            <div
                                key={idx}
                                className={`song-item ${hoveredSong === idx ? 'hover' : ''}`}
                                onMouseEnter={() => setHoveredSong(idx)}
                                onMouseLeave={() => setHoveredSong(null)}
                            >
                                <span className="song-number">{idx + 1}</span>
                                <div className="song-info">
                                    <p className="song-title">{song.title}</p>
                                    <p className="song-artist">{song.artist}</p>
                                </div>
                                <span className="song-language">{song.language}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

HomeTab.propTypes = {
    songs: PropTypes.object.isRequired,
    onMoodSelect: PropTypes.func.isRequired,
    currentMood: PropTypes.string,
}

// Styles object removed

