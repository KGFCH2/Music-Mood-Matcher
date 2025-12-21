import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

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
        chill: '😌',
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
        <div style={styles.container}>
            <h2 style={styles.title}>What's Your Mood?</h2>
            <p style={styles.subtitle}>Select a mood to get personalized song recommendations</p>

            <section aria-labelledby="home-intro" style={styles.introContainer}>
                <h3 id="home-intro" style={styles.introHeading}>Find music that fits your moment</h3>
                <p style={styles.introText}>Music Mood Matcher suggests songs based on your current mood — detected automatically via webcam or selected by you. Fast, private, and tailored playlists help you focus, relax, or celebrate.</p>

                <ul style={styles.featuresList} aria-label="Key features">
                    <li style={styles.featureItem}>Personalized playlists curated per mood</li>
                    <li style={styles.featureItem}>Quick mood detection via webcam (optional)</li>
                    <li style={styles.featureItem}>Save favorites and revisit your listening history</li>
                </ul>

                <div style={styles.howItWorks}>
                    <h4 style={styles.howTitle}>How it works</h4>
                    <ol style={styles.howSteps}>
                        <li style={styles.howStep}><strong>Choose a mood</strong> — tap an emoji or use the webcam to detect your expression.</li>
                        <li style={styles.howStep}><strong>Get recommendations</strong> — see a curated playlist instantly and play previews.</li>
                        <li style={styles.howStep}><strong>Save & enjoy</strong> — add songs to favorites or explore similar tracks.</li>
                    </ol>
                </div>
            </section>

            <section aria-labelledby="music-mood" style={styles.musicMoodContainer}>
                <h3 id="music-mood" style={styles.musicMoodHeading}>🎵 Music & Mood: The Connection</h3>
                <p style={styles.musicMoodText}>
                    Music and emotion are deeply intertwined. Research shows that listening to music activates the same
                    reward centers in your brain as food or drugs. Tempo, key, and instrumentation directly influence how you feel:
                </p>

                <ul style={styles.musicFactsList} aria-label="How music affects mood">
                    <li style={styles.musicFact}><strong>Tempo:</strong> Faster beats elevate energy; slower tempos calm and relax.</li>
                    <li style={styles.musicFact}><strong>Key:</strong> Major keys sound happy and bright; minor keys feel introspective and sad.</li>
                    <li style={styles.musicFact}><strong>Instrumentation:</strong> Strings are intimate; synths are modern; drums drive intensity.</li>
                    <li style={styles.musicFact}><strong>Harmony:</strong> Consonance feels pleasant; dissonance can evoke tension or excitement.</li>
                </ul>

                <div style={styles.typewriterLabel}>Pick your mood, see the musical blueprint:</div>
                <div aria-live="polite" style={styles.typewriterContainer}>
                    <span style={styles.typewriterText}>{typeText}</span>
                    <span style={styles.typewriterCursor} aria-hidden>▌</span>
                </div>

                <p style={styles.musicMoodTextEnd}>
                    Every mood deserves the perfect soundtrack. Let our AI-powered matching find songs that resonate with
                    how you're feeling right now.
                </p>
            </section>

            <section aria-labelledby="psychology-sound" style={styles.psychologyContainer}>
                <h3 id="psychology-sound" style={styles.psychologyHeading}>🧠 The Psychology of Sound</h3>
                <p style={styles.psychologyText}>
                    Did you know that your brain processes music in the same areas that handle basic emotions?
                    This is why a single chord can make you feel nostalgic, or a driving beat can instantly boost your confidence.
                    Music isn't just something we hear; it's something we <em>feel</em>.
                </p>
                <div style={styles.didYouKnow}>
                    <span style={styles.didYouKnowTitle}>Did You Know?</span>
                    <p style={styles.didYouKnowText}>
                        Listening to your favorite music can reduce anxiety by up to 65% and increase productivity by 15%.
                        It's a powerful tool for mental well-being.
                    </p>
                </div>
            </section>

            <div style={styles.moodGrid}>
                {moods.map((mood) => (
                    <button
                        key={mood}
                        onClick={() => onMoodSelect(mood)}
                        onMouseEnter={() => setHoveredMood(mood)}
                        onMouseLeave={() => setHoveredMood(null)}
                        style={{
                            ...styles.moodButton,
                            ...(currentMood === mood && styles.moodButtonActive),
                            ...(hoveredMood === mood && styles.moodButtonHover),
                            borderColor: moodColors[mood],
                            backgroundColor: currentMood === mood ? moodActiveColors[mood] : hoveredMood === mood ? moodHoverColors[mood] : 'transparent',
                        }}
                    >
                        <span style={{ ...styles.moodEmoji, transform: hoveredMood === mood ? 'scale(1.3) rotate(10deg)' : 'scale(1)', filter: hoveredMood === mood ? 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' : 'none' }}>{moodEmojis[mood]}</span>
                        <span style={styles.moodLabel}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
                    </button>
                ))}
            </div>

            {currentMood && (
                <div style={styles.playlistContainer}>
                    <h3 style={styles.playlistTitle}>🎵 Your {currentMood.toUpperCase()} Playlist</h3>
                    <p style={styles.moodDetailText}>{moodDetails[currentMood]}</p>
                    <div style={styles.songList}>
                        {songs[currentMood]?.slice(0, 10).map((song, idx) => (
                            <div
                                key={idx}
                                style={{
                                    ...styles.songItem,
                                    ...(hoveredSong === idx && styles.songItemHover),
                                }}
                                onMouseEnter={() => setHoveredSong(idx)}
                                onMouseLeave={() => setHoveredSong(null)}
                            >
                                <span style={styles.songNumber}>{idx + 1}</span>
                                <div style={styles.songInfo}>
                                    <p style={styles.songTitle}>{song.title}</p>
                                    <p style={styles.songArtist}>{song.artist}</p>
                                </div>
                                <span style={styles.songLanguage}>{song.language}</span>
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

const styles = {
    container: {
        maxWidth: '720px',
        margin: '0 auto',
        padding: '2rem',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '0.5rem',
        textAlign: 'center',
        fontFamily: "'Fira Code', monospace",
        color: 'var(--hacker-green, #00ff7a)',
    },
    subtitle: {
        textAlign: 'center',
        opacity: 0.75,
        marginBottom: '2rem',
        fontFamily: "'Courier New', monospace",
        color: 'rgba(180,255,200,0.9)',
    },
    moodGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '2rem',
    },
    moodButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '1.2rem',
        border: '1px solid rgba(0,255,122,0.08)',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(6,6,10,0.6))',
        backdropFilter: 'blur(6px)',
    },
    moodButtonHover: {
        transform: 'translateY(-3px)',
        boxShadow: '0 10px 28px rgba(0,255,122,0.06)',
    },
    moodButtonActive: {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 34px rgba(0,255,122,0.08)',
    },
    moodEmoji: {
        fontSize: '1.6rem',
        transition: 'transform 0.3s ease, filter 0.3s ease',
    },
    moodLabel: {
        fontSize: '0.95rem',
        fontWeight: 700,
        color: 'rgba(180,255,200,0.95)',
    },
    playlistContainer: {
        marginTop: '2rem',
        padding: '1.4rem',
        borderRadius: '10px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(6,6,10,0.65))',
        border: '1px solid rgba(0,255,122,0.06)',
    },
    playlistTitle: {
        fontSize: '1.2rem',
        fontWeight: 800,
        marginBottom: '1rem',
        color: 'var(--hacker-cyan, #00e5ff)',
    },
    songList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
    },
    songItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.8rem',
        borderRadius: '8px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(6,6,10,0.6))',
        transition: 'background 0.18s, transform 0.18s, box-shadow 0.18s',
        cursor: 'pointer',
    },
    songItemHover: {
        background: 'linear-gradient(180deg, rgba(0,255,122,0.1), rgba(6,6,10,0.7))',
        transform: 'translateX(10px) scale(1.02)',
        boxShadow: '0 4px 12px rgba(0,255,122,0.2)',
    },
    songNumber: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2rem',
        height: '2rem',
        borderRadius: '50%',
        background: 'linear-gradient(90deg, rgba(0,255,122,0.12), rgba(124,77,255,0.05))',
        fontWeight: 700,
        fontSize: '0.85rem',
    },
    songInfo: {
        flex: 1,
        minWidth: 0,
    },
    songTitle: {
        margin: 0,
        fontWeight: 700,
        fontSize: '0.98rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    songArtist: {
        margin: '0.2rem 0 0 0',
        fontSize: '0.85rem',
        opacity: 0.78,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    songLanguage: {
        fontSize: '0.75rem',
        padding: '0.28rem 0.6rem',
        borderRadius: '6px',
        background: 'linear-gradient(90deg, rgba(0,229,255,0.06), rgba(0,255,122,0.04))',
        whiteSpace: 'nowrap',
    },
    /* New intro / info styles */
    introContainer: {
        margin: '1.5rem 0 2rem 0',
        padding: '1rem',
        borderRadius: '10px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(124,77,255,0.02))',
        border: '1px solid rgba(124,77,255,0.06)',
    },
    introHeading: {
        margin: 0,
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'var(--primary, #7c4dff)',
    },
    introText: {
        marginTop: '0.4rem',
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 1.45,
        fontSize: '0.98rem',
    },
    featuresList: {
        marginTop: '0.8rem',
        display: 'flex',
        gap: '0.8rem',
        listStyle: 'disc',
        paddingLeft: '1.2rem',
        flexWrap: 'wrap',
    },
    featureItem: {
        flex: '1 1 200px',
        fontSize: '0.95rem',
        color: 'rgba(200,220,255,0.95)',
    },
    howItWorks: {
        marginTop: '1rem',
    },
    howTitle: {
        margin: 0,
        fontSize: '0.95rem',
        fontWeight: 700,
        color: 'var(--accent, #00e5ff)',
    },
    howSteps: {
        marginTop: '0.5rem',
        paddingLeft: '1.2rem',
    },
    howStep: {
        marginBottom: '0.45rem',
        color: 'rgba(200,220,255,0.9)',
        fontSize: '0.92rem',
    },
    /* Music & Mood + typewriter */
    musicMoodContainer: {
        marginTop: '1.5rem',
        padding: '1rem',
        borderRadius: '10px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.4), rgba(6,6,10,0.45))',
        border: '1px solid rgba(0,255,122,0.04)',
    },
    musicMoodHeading: {
        margin: 0,
        fontSize: '1.05rem',
        fontWeight: 700,
        color: 'var(--primary, #7c4dff)',
    },
    musicMoodText: {
        marginTop: '0.4rem',
        color: 'rgba(220,230,255,0.95)',
        lineHeight: 1.45,
        fontSize: '0.95rem',
    },
    typewriterContainer: {
        marginTop: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.95rem',
    },
    typewriterText: {
        color: 'var(--accent, #00e5ff)',
        fontWeight: 700,
        minHeight: '1.15em',
    },
    typewriterCursor: {
        color: 'rgba(200,255,230,0.95)',
        opacity: 0.95,
        transform: 'translateY(-2px)',
    },
    /* Music facts & science section */
    musicFactsList: {
        marginTop: '0.8rem',
        paddingLeft: '1.2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        listStyle: 'circle',
    },
    musicFact: {
        fontSize: '0.92rem',
        color: 'rgba(220,230,255,0.93)',
        lineHeight: 1.35,
    },
    typewriterLabel: {
        marginTop: '0.8rem',
        fontSize: '0.85rem',
        color: 'rgba(200,220,255,0.8)',
        fontStyle: 'italic',
    },
    musicMoodTextEnd: {
        marginTop: '0.8rem',
        color: 'rgba(200,220,255,0.9)',
        lineHeight: 1.4,
        fontSize: '0.93rem',
    },
    /* Psychology & Did You Know styles */
    psychologyContainer: {
        marginTop: '1.5rem',
        padding: '1rem',
        borderRadius: '10px',
        background: 'linear-gradient(180deg, rgba(124,77,255,0.03), rgba(0,229,255,0.03))',
        border: '1px solid rgba(124,77,255,0.08)',
        marginBottom: '2rem',
    },
    psychologyHeading: {
        margin: 0,
        fontSize: '1.05rem',
        fontWeight: 700,
        color: 'var(--hacker-cyan, #00e5ff)',
    },
    psychologyText: {
        marginTop: '0.4rem',
        color: 'rgba(220,230,255,0.95)',
        lineHeight: 1.45,
        fontSize: '0.95rem',
    },
    didYouKnow: {
        marginTop: '1rem',
        padding: '0.8rem',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '8px',
        borderLeft: '3px solid var(--hacker-green, #00ff7a)',
    },
    didYouKnowTitle: {
        fontSize: '0.85rem',
        fontWeight: 800,
        color: 'var(--hacker-green, #00ff7a)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    didYouKnowText: {
        marginTop: '0.2rem',
        fontSize: '0.9rem',
        color: 'rgba(200,255,230,0.9)',
        margin: 0,
    },
    moodDetailText: {
        fontSize: '0.9rem',
        color: 'rgba(200,220,255,0.85)',
        marginBottom: '1.2rem',
        fontStyle: 'italic',
        lineHeight: 1.4,
    },
}
