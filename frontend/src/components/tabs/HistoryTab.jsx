import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './tabs.css'

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
        return <div className="tab-container">Please log in to view mood history</div>
    }

    if (loading) {
        return <div className="tab-container">Loading...</div>
    }

    if (moodHistory.length === 0) {
        return (
            <div className="tab-container">
                <div className="empty-state">
                    <p className="empty-emoji">📊</p>
                    <h3>No Mood History Yet</h3>
                    <p>Start detecting your moods to build your history!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="tab-container">
            <h2 className="tab-title">Your Mood History</h2>
            <div className="history-list">
                {moodHistory.map((entry, idx) => (
                    <div key={idx} className="history-item tab-section">
                        <div className="item-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span className="mood-emoji" style={{ fontSize: '2rem' }}>{getMoodEmoji(entry.mood)}</span>
                            <div className="item-info">
                                <p className="item-mood" style={{ margin: 0, fontWeight: 'bold' }}>{entry.mood.toUpperCase()}</p>
                                <p className="item-time" style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>{formatDate(entry.timestamp)}</p>
                            </div>
                        </div>
                        {entry.songs && entry.songs.length > 0 && (
                            <div className="item-songs" style={{ marginTop: '0.5rem', opacity: 0.8, fontSize: '0.9rem' }}>
                                <p>Songs played: {entry.songs.length}</p>
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


