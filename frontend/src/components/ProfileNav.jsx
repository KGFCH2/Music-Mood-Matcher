import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import './profile-nav.css'

export default function ProfileNav({ user, onClose }) {
    const [expandedSection, setExpandedSection] = useState(null)

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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getLoginCount = () => {
        return user?.loginHistory?.length || 1
    }

    const getLastLogin = () => {
        if (!user?.loginHistory || user.loginHistory.length === 0) return 'N/A'
        const logins = [...user.loginHistory].sort()
        return formatDate(logins[logins.length - 1])
    }

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section)
    }

    return (
        <AnimatePresence>
            <div className="profile-nav-overlay" onClick={onClose}>
                <motion.div
                    className="profile-nav-panel"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
                >
                    {/* Header */}
                    <div className="profile-header">
                        <motion.button
                            className="close-btn"
                            onClick={onClose}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            ✕
                        </motion.button>
                        <h2>👤 My Profile</h2>
                    </div>

                    {/* Main Profile Card */}
                    <motion.div
                        className="profile-main-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="profile-avatar-section">
                            <div className="profile-avatar-large">{getGenderAvatar(user?.gender)}</div>
                        </div>
                        <h3 className="profile-name">{user?.userName || 'User'}</h3>
                        <p className="profile-email-main">{user?.email || 'No email'}</p>
                        <p className="profile-gender-main">
                            <span className="gender-badge">{getGenderAvatar(user?.gender)} {user?.gender?.charAt(0).toUpperCase() + user?.gender?.slice(1) || 'Not specified'}</span>
                        </p>
                        <div className="profile-badge">
                            {user?.isVerified ? (
                                <>
                                    <span className="verified-icon">✅</span>
                                    <span className="verified-text">Verified User</span>
                                </>
                            ) : (
                                <>
                                    <span className="unverified-icon">⏳</span>
                                    <span className="unverified-text">Pending Verification</span>
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Verification Notice for Unverified Users */}
                    {!user?.isVerified && (
                        <motion.div
                            className="verification-notice"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <span className="notice-icon">⏳</span>
                            <div className="notice-content">
                                <p className="notice-title">Account Pending Verification</p>
                                <p className="notice-text">Please check your email for the verification code to complete your registration.</p>
                                <p className="notice-code" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#00e5ff' }}>
                                    Code: {user?.verificationCode || 'Check your email'}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Sections */}
                    <div className="profile-sections">
                        {/* Account Information Section */}
                        <motion.div
                            className="profile-section"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <motion.button
                                className={`section-toggle ${expandedSection === 'account' ? 'active' : ''}`}
                                onClick={() => toggleSection('account')}
                                whileHover={{ backgroundColor: 'rgba(124, 77, 255, 0.05)' }}
                            >
                                <span className="toggle-icon">ℹ️</span>
                                <span className="toggle-title">Account Information</span>
                                <span className={`toggle-arrow ${expandedSection === 'account' ? 'open' : ''}`}>›</span>
                            </motion.button>

                            <AnimatePresence>
                                {expandedSection === 'account' && (
                                    <motion.div
                                        className="section-content"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="info-row">
                                            <span className="info-label">📧 Email:</span>
                                            <span className="info-value">{user?.email || 'N/A'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">👤 Name:</span>
                                            <span className="info-value">{user?.userName || 'N/A'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">✨ Gender:</span>
                                            <span className="info-value">
                                                {getGenderAvatar(user?.gender)} {user?.gender?.charAt(0).toUpperCase() + user?.gender?.slice(1) || 'Not specified'}
                                            </span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">🔐 User ID:</span>
                                            <span className="info-value info-code">{user?.userId || 'N/A'}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Registration Details Section */}
                        <motion.div
                            className="profile-section"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.button
                                className={`section-toggle ${expandedSection === 'registration' ? 'active' : ''}`}
                                onClick={() => toggleSection('registration')}
                                whileHover={{ backgroundColor: 'rgba(124, 77, 255, 0.05)' }}
                            >
                                <span className="toggle-icon">📅</span>
                                <span className="toggle-title">Registration Details</span>
                                <span className={`toggle-arrow ${expandedSection === 'registration' ? 'open' : ''}`}>›</span>
                            </motion.button>

                            <AnimatePresence>
                                {expandedSection === 'registration' && (
                                    <motion.div
                                        className="section-content"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="info-row">
                                            <span className="info-label">📝 Registered On:</span>
                                            <span className="info-value">{formatDate(user?.registeredAt)}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">✅ Verification Status:</span>
                                            <span className={`info-value ${user?.isVerified ? 'verified' : 'unverified'}`}>
                                                {user?.isVerified ? '✓ Verified' : '⏳ Pending'}
                                            </span>
                                        </div>
                                        {user?.verificationCode && (
                                            <div className="info-row">
                                                <span className="info-label">🔐 Verification Code:</span>
                                                <span className="info-value info-code">{user.verificationCode}</span>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Login History Section */}
                        <motion.div
                            className="profile-section"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            <motion.button
                                className={`section-toggle ${expandedSection === 'history' ? 'active' : ''}`}
                                onClick={() => toggleSection('history')}
                                whileHover={{ backgroundColor: 'rgba(124, 77, 255, 0.05)' }}
                            >
                                <span className="toggle-icon">🕐</span>
                                <span className="toggle-title">Login History</span>
                                <span className="history-count">{getLoginCount()}</span>
                                <span className={`toggle-arrow ${expandedSection === 'history' ? 'open' : ''}`}>›</span>
                            </motion.button>

                            <AnimatePresence>
                                {expandedSection === 'history' && (
                                    <motion.div
                                        className="section-content"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="info-row">
                                            <span className="info-label">🔢 Total Logins:</span>
                                            <span className="info-value">{getLoginCount()} times</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">⏰ Last Login:</span>
                                            <span className="info-value">{getLastLogin()}</span>
                                        </div>
                                        {user?.loginHistory && user.loginHistory.length > 0 && (
                                            <div className="login-history-list">
                                                <p className="history-label">📋 Recent Logins:</p>
                                                <div className="history-items">
                                                    {[...user.loginHistory]
                                                        .reverse()
                                                        .slice(0, 5)
                                                        .map((login, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                className="history-item"
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                            >
                                                                <span className="item-number">{getLoginCount() - idx}</span>
                                                                <span className="item-date">{formatDate(login)}</span>
                                                            </motion.div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Privacy & Security Section */}
                        <motion.div
                            className="profile-section"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <motion.button
                                className={`section-toggle ${expandedSection === 'privacy' ? 'active' : ''}`}
                                onClick={() => toggleSection('privacy')}
                                whileHover={{ backgroundColor: 'rgba(124, 77, 255, 0.05)' }}
                            >
                                <span className="toggle-icon">🔒</span>
                                <span className="toggle-title">Privacy & Security</span>
                                <span className={`toggle-arrow ${expandedSection === 'privacy' ? 'open' : ''}`}>›</span>
                            </motion.button>

                            <AnimatePresence>
                                {expandedSection === 'privacy' && (
                                    <motion.div
                                        className="section-content"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="privacy-info">
                                            <div className="privacy-item">
                                                <span className="privacy-icon">🔐</span>
                                                <span className="privacy-text">Your data is stored locally in your browser</span>
                                            </div>
                                            <div className="privacy-item">
                                                <span className="privacy-icon">🛡️</span>
                                                <span className="privacy-text">No data is sent to external servers</span>
                                            </div>
                                            <div className="privacy-item">
                                                <span className="privacy-icon">👤</span>
                                                <span className="privacy-text">Only you can access your profile data</span>
                                            </div>
                                            <div className="privacy-item">
                                                <span className="privacy-icon">📊</span>
                                                <span className="privacy-text">Your preferences and favorites are private</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Footer Note */}
                    <motion.div
                        className="profile-footer-note"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                    >
                        <span className="note-icon">💡</span>
                        <span className="note-text">Your profile data helps personalize your experience</span>
                    </motion.div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

ProfileNav.propTypes = {
    user: PropTypes.shape({
        userId: PropTypes.string,
        email: PropTypes.string,
        userName: PropTypes.string,
        gender: PropTypes.string,
        registeredAt: PropTypes.string,
        loginHistory: PropTypes.arrayOf(PropTypes.string),
        isVerified: PropTypes.bool,
        verificationCode: PropTypes.string
    }).isRequired,
    onClose: PropTypes.func.isRequired
}
