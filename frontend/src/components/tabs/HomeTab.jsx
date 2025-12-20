import React, { useState } from 'react'
import PropTypes from 'prop-types'

export default function HomeTab({ songs, selectedLanguage, onMoodSelect, currentMood }) {
    const [hoveredMood, setHoveredMood] = useState(null)

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

    const moods = Object.keys(moodEmojis)

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>What's Your Mood?</h2>
            <p style={styles.subtitle}>Select a mood to get personalized song recommendations</p>

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
                            backgroundColor: currentMood === mood ? `${moodColors[mood]}20` : 'transparent',
                        }}
                    >
                        <span style={styles.moodEmoji}>{moodEmojis[mood]}</span>
                        <span style={styles.moodLabel}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
                    </button>
                ))}
            </div>

            {currentMood && (
                <div style={styles.playlistContainer}>
                    <h3 style={styles.playlistTitle}>🎵 Your {currentMood.toUpperCase()} Playlist</h3>
                    <div style={styles.songList}>
                        {songs[currentMood]?.slice(0, 10).map((song, idx) => (
                            <div key={idx} style={styles.songItem}>
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
    selectedLanguage: PropTypes.string.isRequired,
    onMoodSelect: PropTypes.func.isRequired,
    currentMood: PropTypes.string,
}

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem',
    },
    title: {
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        opacity: 0.7,
        marginBottom: '2rem',
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
        padding: '1.5rem',
        border: '2px solid',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
    },
    moodButtonHover: {
        transform: 'scale(1.05)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    },
    moodButtonActive: {
        transform: 'scale(1.1)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
    },
    moodEmoji: {
        fontSize: '2rem',
    },
    moodLabel: {
        fontSize: '0.9rem',
        fontWeight: '600',
    },
    playlistContainer: {
        marginTop: '2rem',
        padding: '1.5rem',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(124,77,255,0.1), rgba(0,229,255,0.05))',
        border: '1px solid rgba(124,77,255,0.2)',
    },
    playlistTitle: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
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
        background: 'rgba(255, 255, 255, 0.05)',
        transition: 'background 0.2s',
    },
    songNumber: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2rem',
        height: '2rem',
        borderRadius: '50%',
        background: 'rgba(124,77,255,0.3)',
        fontWeight: 'bold',
        fontSize: '0.85rem',
    },
    songInfo: {
        flex: 1,
        minWidth: 0,
    },
    songTitle: {
        margin: 0,
        fontWeight: '600',
        fontSize: '0.95rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    songArtist: {
        margin: '0.2rem 0 0 0',
        fontSize: '0.8rem',
        opacity: 0.7,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    songLanguage: {
        fontSize: '0.75rem',
        padding: '0.3rem 0.6rem',
        borderRadius: '4px',
        background: 'rgba(0,229,255,0.2)',
        whiteSpace: 'nowrap',
    },
}
