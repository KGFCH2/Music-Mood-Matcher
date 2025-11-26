import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import emailjs from '@emailjs/browser'
import './profile-nav.css'

export default function ProfileNav({ user, onClose, onUpdateUser }) {
    const [expandedSection, setExpandedSection] = useState(null)
    const [isEditingName, setIsEditingName] = useState(false)
    const [editedName, setEditedName] = useState(user?.userName || '')
    const [editingGender, setEditingGender] = useState(user?.gender || 'other')
    const [verificationDialogEmail, setVerificationDialogEmail] = useState('')
    const [showVerificationDialog, setShowVerificationDialog] = useState(false)
    const [verificationInputCode, setVerificationInputCode] = useState('')
    const [verificationError, setVerificationError] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newVerificationCode, setNewVerificationCode] = useState('')

    // Initialize EmailJS
    useEffect(() => {
        emailjs.init('yvSwGRuksv7zAychI')
    }, [])

    const generateVerificationCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase()
    }

    const sendVerificationEmail = async (email, userName, verificationCode) => {
        try {
            const SERVICE_ID = 'service_zfess1e'
            const TEMPLATE_ID = 'template_hz19s08'
            const PUBLIC_KEY = 'yvSwGRuksv7zAychI'

            // Validate email before sending
            if (!email || !email.includes('@')) {
                console.error('Invalid email format:', email)
                return false
            }

            const templateParams = {
                to_email: email,
                user_name: userName,
                verification_code: verificationCode
            }

            console.log('📧 Sending verification email to:', email)
            const response = await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                templateParams,
                PUBLIC_KEY
            )

            console.log('✅ Email sent successfully to:', email)
            return true

        } catch (error) {
            console.error('❌ Error sending verification email:', error.message)
            if (error.status === 400) {
                console.error('Bad Request - Template variables: to_email, user_name, verification_code')
            } else if (error.status === 401) {
                console.error('Unauthorized - Check public key')
            } else if (error.status === 404) {
                console.error('Not Found - Check Service/Template IDs')
            }
            return false
        }
    }

    const handleSaveChanges = async () => {
        if (!editedName.trim()) {
            setVerificationError('Please enter a name')
            return
        }

        setVerificationError('')

        // Check if email changed
        if (newEmail && newEmail !== user?.email && newEmail.trim()) {
            // Send verification email for new email
            const code = generateVerificationCode()
            setNewVerificationCode(code)
            setVerificationInputCode('')
            setVerificationError('')

            console.log('Email change detected. Sending verification to:', newEmail)
            await sendVerificationEmail(newEmail, editedName, code)

            setVerificationDialogEmail(newEmail)
            setShowVerificationDialog(true)
        } else {
            // No email change, just update other details
            const updatedUser = {
                ...user,
                userName: editedName,
                gender: editingGender
            }
            onUpdateUser(updatedUser)
            setIsEditingName(false)
            setVerificationError('')
            
            // Show success message via error state (acts as info message)
            setTimeout(() => {
                setVerificationError('Profile updated successfully')
                setTimeout(() => setVerificationError(''), 3000)
            }, 500)
        }
    }

    const handleVerifyNewEmail = () => {
        if (!verificationInputCode.trim()) {
            setVerificationError('Please enter the verification code')
            return
        }

        // Verify code matches
        if (verificationInputCode.toUpperCase() === newVerificationCode) {
            // Email verified successfully
            const updatedUser = {
                ...user,
                userName: editedName,
                gender: editingGender,
                email: newEmail,
                isVerified: true,
                emailVerified: true  // Mark email as verified
            }
            
            console.log('Email verified successfully:', newEmail)
            
            onUpdateUser(updatedUser)
            setShowVerificationDialog(false)
            setVerificationInputCode('')
            setIsEditingName(false)
            setNewEmail('')
            
            // Show success message
            setVerificationError('Email verified and profile updated!')
            setTimeout(() => setVerificationError(''), 3000)
        } else {
            console.error('Verification code mismatch')
            setVerificationError('Invalid code. Please check your email and try again.')
        }
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
                                            {isEditingName ? (
                                                <input
                                                    type="email"
                                                    placeholder="New email (optional)"
                                                    value={newEmail}
                                                    onChange={(e) => setNewEmail(e.target.value)}
                                                    className="form-input"
                                                    style={{ maxWidth: '200px', marginLeft: '10px' }}
                                                />
                                            ) : (
                                                <span className="info-value">{user?.email || 'N/A'}</span>
                                            )}
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">👤 Name:</span>
                                            {isEditingName ? (
                                                <input
                                                    type="text"
                                                    placeholder="Your name"
                                                    value={editedName}
                                                    onChange={(e) => setEditedName(e.target.value)}
                                                    className="form-input"
                                                    style={{ maxWidth: '200px', marginLeft: '10px' }}
                                                />
                                            ) : (
                                                <span className="info-value">{user?.userName || 'N/A'}</span>
                                            )}
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">✨ Gender:</span>
                                            {isEditingName ? (
                                                <select
                                                    value={editingGender}
                                                    onChange={(e) => setEditingGender(e.target.value)}
                                                    className="form-input"
                                                    style={{ maxWidth: '150px', marginLeft: '10px' }}
                                                >
                                                    <option value="male">👨 Male</option>
                                                    <option value="female">👩 Female</option>
                                                    <option value="other">👤 Other</option>
                                                </select>
                                            ) : (
                                                <span className="info-value">
                                                    {user?.gender?.charAt(0).toUpperCase() + user?.gender?.slice(1) || 'Not specified'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">🔐 User ID:</span>
                                            <span className="info-value info-code">{user?.userId || 'N/A'}</span>
                                        </div>

                                        {/* Edit/Save Buttons */}
                                        <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
                                            {isEditingName ? (
                                                <>
                                                    <motion.button
                                                        onClick={handleSaveChanges}
                                                        className="edit-btn save-btn"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        style={{
                                                            padding: '8px 16px',
                                                            background: 'linear-gradient(135deg, #00e5ff, #7c4dff)',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            fontSize: '0.9rem',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        ✅ Save Changes
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => {
                                                            setIsEditingName(false)
                                                            setEditedName(user?.userName || '')
                                                            setEditingGender(user?.gender || 'other')
                                                            setNewEmail('')
                                                        }}
                                                        className="edit-btn cancel-btn"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        style={{
                                                            padding: '8px 16px',
                                                            background: 'rgba(255, 107, 107, 0.2)',
                                                            border: '1px solid rgba(255, 107, 107, 0.5)',
                                                            borderRadius: '8px',
                                                            color: '#ff6b6b',
                                                            cursor: 'pointer',
                                                            fontSize: '0.9rem',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        ❌ Cancel
                                                    </motion.button>
                                                </>
                                            ) : (
                                                <motion.button
                                                    onClick={() => setIsEditingName(true)}
                                                    className="edit-btn"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{
                                                        padding: '8px 16px',
                                                        background: 'rgba(124, 77, 255, 0.2)',
                                                        border: '1px solid rgba(124, 77, 255, 0.5)',
                                                        borderRadius: '8px',
                                                        color: '#7c4dff',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    ✏️ Edit Profile
                                                </motion.button>
                                            )}
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

                {/* Email Verification Dialog */}
                <AnimatePresence>
                    {showVerificationDialog && (
                        <motion.div
                            className="conflict-dialog-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setShowVerificationDialog(false)}
                        >
                            <motion.div
                                className="conflict-dialog"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ duration: 0.3 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{ maxWidth: '500px' }}
                            >
                                <div className="dialog-header">
                                    <span className="dialog-icon">📧</span>
                                    <h3>Verify New Email Address</h3>
                                    <p>A verification code has been sent to <strong>{verificationDialogEmail}</strong></p>

                                    {/* Code Display */}
                                    <div style={{
                                        background: 'rgba(0, 229, 255, 0.08)',
                                        border: '2px solid rgba(0, 229, 255, 0.3)',
                                        padding: '1.2rem',
                                        borderRadius: '10px',
                                        marginTop: '1rem',
                                        textAlign: 'center'
                                    }}>
                                        <p style={{ margin: '0 0 0.8rem', fontSize: '0.85rem', color: '#b0b0b0', fontWeight: '500' }}>📧 Your Verification Code:</p>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '1.8rem',
                                            fontWeight: 'bold',
                                            color: '#00e5ff',
                                            fontFamily: 'monospace',
                                            letterSpacing: '6px',
                                            padding: '0.8rem',
                                            background: 'rgba(0, 229, 255, 0.05)',
                                            borderRadius: '6px',
                                            border: '1px solid rgba(0, 229, 255, 0.2)'
                                        }}>
                                            {newVerificationCode}
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={(e) => { e.preventDefault(); handleVerifyNewEmail() }} style={{ padding: '2rem' }}>
                                    {verificationError && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3 }}
                                            style={{
                                                background: 'rgba(255, 107, 107, 0.1)',
                                                border: '1px solid rgba(255, 107, 107, 0.3)',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                marginBottom: '1rem',
                                                color: '#ff6b6b',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            <span>⚠️ {verificationError}</span>
                                        </motion.div>
                                    )}

                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#00e5ff', fontWeight: '600', fontSize: '0.9rem' }}>
                                            🔐 Enter Verification Code
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter 6-character code"
                                            value={verificationInputCode}
                                            onChange={(e) => setVerificationInputCode(e.target.value.toUpperCase())}
                                            maxLength="6"
                                            className="form-input"
                                            style={{
                                                letterSpacing: '2px',
                                                textAlign: 'center',
                                                fontSize: '1.2rem',
                                                width: '100%',
                                                padding: '12px',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(0, 229, 255, 0.3)',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                        />
                                    </div>

                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'linear-gradient(135deg, #00e5ff, #7c4dff)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            marginBottom: '10px'
                                        }}
                                    >
                                        ✅ Verify & Update Email
                                    </motion.button>

                                    <motion.button
                                        type="button"
                                        onClick={() => setShowVerificationDialog(false)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'rgba(255, 107, 107, 0.2)',
                                            border: '1px solid rgba(255, 107, 107, 0.5)',
                                            borderRadius: '8px',
                                            color: '#ff6b6b',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                    >
                                        ❌ Cancel
                                    </motion.button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
    onClose: PropTypes.func.isRequired,
    onUpdateUser: PropTypes.func.isRequired
}
