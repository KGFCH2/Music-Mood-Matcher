import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './tabs.css'

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
        return <div className="tab-container">Please log in to view favorites</div>
    }

    if (loading) {
        return <div className="tab-container">Loading...</div>
    }

    if (favorites.length === 0) {
        return (
            <div className="tab-container">
                <div className="empty-state">
                    <p className="empty-emoji">⭐</p>
                    <h3>No Favorites Yet</h3>
                    <p>Add songs to your favorites to see them here!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="tab-container">
            <h2 className="tab-title">❤️ Your Favorites</h2>
            <p className="tab-subtitle">{favorites.length} favorite songs</p>

            <div className="song-list">
                {favorites.map((song, idx) => (
                    <div key={idx} className="song-item">
                        <div className="song-info">
                            <p className="song-title">{song.songName || song.title}</p>
                            <p className="song-artist">{song.artist}</p>
                        </div>
                        <span
                            className="mood-badge"
                            style={{
                                color: getMoodColor(song.mood),
                            }}
                        >
                            {song.mood}
                        </span>
                        <button
                            onClick={() => handleRemove(song.songId || song.id)}
                            className="remove-btn"
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


