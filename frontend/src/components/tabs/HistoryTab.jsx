import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export default function HistoryTab({ user }) {
    const [moodHistory, setMoodHistory] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user?.userId) {
            loadMoodHistory()
        }
    }, [user?.userId])

    const loadMoodHistory = () => {
        setLoading(true)
        try {
            const key = `musicMoodHistory-${user.userId}`
            const saved = localStorage.getItem(key)
            if (saved) {
                const history = JSON.parse(saved)
                setMoodHistory(Array.isArray(history) ? history.reverse() : [])
            }
        } catch (error) {
            console.error('Error loading mood history:', error)
        } finally {
            setLoading(false)
        }
    }

    const getMoodEmoji = (mood) => {
        const emojis = {
            happy: '😊',
            sad: '😢',
            energetic: '⚡',
            romantic: '💕',
            chill: '😌',
            angry: '😠',
        }
        return emojis[mood] || '🎵'
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return date.toLocaleDateString()
    }

    if (!user) {
        return <div style={styles.container}>Please log in to view mood history</div>
    }

    if (loading) {
        return <div style={styles.container}>Loading...</div>
    }

    if (moodHistory.length === 0) {
        return (
            <div style={styles.container}>
                <div style={styles.emptyState}>
                    <p style={styles.emptyEmoji}>📊</p>
                    <h3>No Mood History Yet</h3>
                    <p>Start detecting your moods to build your history!</p>
                </div>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Your Mood History</h2>
            <div style={styles.historyList}>
                {moodHistory.map((entry, idx) => (
                    <div key={idx} style={styles.historyItem}>
                        <div style={styles.itemHeader}>
                            <span style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</span>
                            <div style={styles.itemInfo}>
                                <p style={styles.itemMood}>{entry.mood.toUpperCase()}</p>
                                <p style={styles.itemTime}>{formatDate(entry.timestamp)}</p>
                            </div>
                        </div>
                        {entry.songs && entry.songs.length > 0 && (
                            <div style={styles.itemSongs}>
                                <p style={styles.songsLabel}>Songs played: {entry.songs.length}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

HistoryTab.propTypes = {
    user: PropTypes.shape({
        userId: PropTypes.string,
    }),
}

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem 1rem',
    },
    title: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        textAlign: 'center',
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
    historyList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    historyItem: {
        padding: '1.2rem',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(124,77,255,0.1), rgba(0,229,255,0.05))',
        border: '1px solid rgba(124,77,255,0.2)',
        transition: 'all 0.3s ease',
    },
    itemHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    moodEmoji: {
        fontSize: '2rem',
        flexShrink: 0,
    },
    itemInfo: {
        flex: 1,
        minWidth: 0,
    },
    itemMood: {
        margin: 0,
        fontWeight: '600',
        fontSize: '1rem',
    },
    itemTime: {
        margin: '0.3rem 0 0 0',
        fontSize: '0.85rem',
        opacity: 0.7,
    },
    itemSongs: {
        marginTop: '0.8rem',
        paddingTop: '0.8rem',
        borderTop: '1px solid rgba(124,77,255,0.1)',
    },
    songsLabel: {
        margin: 0,
        fontSize: '0.9rem',
        opacity: 0.8,
    },
}
