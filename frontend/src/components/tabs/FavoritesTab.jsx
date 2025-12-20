import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export default function FavoritesTab({ user, onRemove }) {
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user?.userId) {
            loadFavorites()
        }
    }, [user?.userId])

    const loadFavorites = () => {
        setLoading(true)
        try {
            const key = `musicMoodFavorites-${user.userId}`
            const saved = localStorage.getItem(key)
            if (saved) {
                const faves = JSON.parse(saved)
                setFavorites(Array.isArray(faves) ? faves : [])
            }
        } catch (error) {
            console.error('Error loading favorites:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = (songId) => {
        try {
            const updated = favorites.filter((fav) => fav.songId !== songId)
            setFavorites(updated)
            const key = `musicMoodFavorites-${user.userId}`
            localStorage.setItem(key, JSON.stringify(updated))
            if (onRemove) onRemove(songId)
        } catch (error) {
            console.error('Error removing favorite:', error)
        }
    }

    const getMoodColor = (mood) => {
        const colors = {
            happy: '#FFD700',
            sad: '#4B0082',
            energetic: '#FF4500',
            romantic: '#FF1493',
            chill: '#87CEEB',
            angry: '#DC143C',
        }
        return colors[mood] || '#6366f1'
    }

    if (!user) {
        return <div style={styles.container}>Please log in to view favorites</div>
    }

    if (loading) {
        return <div style={styles.container}>Loading...</div>
    }

    if (favorites.length === 0) {
        return (
            <div style={styles.container}>
                <div style={styles.emptyState}>
                    <p style={styles.emptyEmoji}>⭐</p>
                    <h3>No Favorites Yet</h3>
                    <p>Add songs to your favorites to see them here!</p>
                </div>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>❤️ Your Favorites</h2>
            <p style={styles.count}>{favorites.length} favorite songs</p>

            <div style={styles.favoritesList}>
                {favorites.map((song, idx) => (
                    <div key={idx} style={styles.favoriteItem}>
                        <div style={styles.itemContent}>
                            <div style={styles.songInfo}>
                                <p style={styles.songTitle}>{song.songName}</p>
                                <p style={styles.songArtist}>{song.artist}</p>
                            </div>
                            <span
                                style={{
                                    ...styles.moodBadge,
                                    borderColor: getMoodColor(song.mood),
                                    color: getMoodColor(song.mood),
                                }}
                            >
                                {song.mood}
                            </span>
                        </div>
                        <button
                            onClick={() => handleRemove(song.songId)}
                            style={styles.removeBtn}
                            title="Remove from favorites"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

FavoritesTab.propTypes = {
    user: PropTypes.shape({
        userId: PropTypes.string,
    }),
    onRemove: PropTypes.func,
}

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem',
    },
    title: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
    },
    count: {
        opacity: 0.7,
        marginBottom: '1.5rem',
        fontSize: '0.95rem',
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem 1rem',
        opacity: 0.6,
    },
    emptyEmoji: {
        fontSize: '3rem',
        marginBottom: '1rem',
    },
    favoritesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    favoriteItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1.2rem',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(124,77,255,0.1), rgba(0,229,255,0.05))',
        border: '1px solid rgba(124,77,255,0.2)',
        transition: 'all 0.3s ease',
    },
    itemContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flex: 1,
    },
    songInfo: {
        flex: 1,
        minWidth: 0,
    },
    songTitle: {
        margin: 0,
        fontWeight: '600',
        fontSize: '1rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    songArtist: {
        margin: '0.3rem 0 0 0',
        fontSize: '0.85rem',
        opacity: 0.7,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    moodBadge: {
        display: 'inline-block',
        padding: '0.4rem 0.8rem',
        borderRadius: '6px',
        border: '2px solid',
        fontSize: '0.75rem',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        textTransform: 'capitalize',
    },
    removeBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2rem',
        height: '2rem',
        borderRadius: '50%',
        border: 'none',
        background: 'rgba(220, 38, 38, 0.2)',
        color: '#DC2626',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'all 0.2s',
    },
}
