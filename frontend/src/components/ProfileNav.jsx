import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import emailjs from '@emailjs/browser'
import './profile-nav.css'

export default function ProfileNav({ user, onClose, onUpdateUser, onLogout }) {
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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState('')
    const [showEmailVerificationDialog, setShowEmailVerificationDialog] = useState(false)
    const [emailVerificationCode, setEmailVerificationCode] = useState('')
    const [emailVerificationError, setEmailVerificationError] = useState('')
    const [emailVerificationSent, setEmailVerificationSent] = useState(false)

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

            // Template variables with multiple names for compatibility
            const templateParams = {
                to_email: email,
                recipient_email: email,
                email_address: email,
                user_name: userName,
                verification_code: verificationCode,
                code: verificationCode
            }

            console.log('📧 Sending verification email')
            console.log('Recipient Email (to_email):', email)
            console.log('User Name:', userName)
            console.log('Verification Code:', verificationCode)

            const response = await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                templateParams,
                PUBLIC_KEY
            )

            console.log('✅ Email sent successfully!')
            return true

        } catch (error) {
            console.error('❌ Error sending verification email:', error.message)
            if (error.status === 400) {
                console.error('Bad Request - Check template uses: {{to_email}}, {{user_name}}, {{verification_code}}')
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

    const handleSendVerificationEmail = async () => {
        if (!user?.email) {
            setEmailVerificationError('User email not found')
            return
        }

        const code = generateVerificationCode()
        setEmailVerificationCode(code)
        setEmailVerificationError('')
        setEmailVerificationSent(true)

        // Send verification email
        await sendVerificationEmail(user.email, user.userName, code)
        console.log('Verification email sent to:', user.email)
    }

    const handleVerifyEmail = () => {
        if (!emailVerificationCode.trim()) {
            setEmailVerificationError('Please enter the verification code')
            return
        }

        if (emailVerificationCode.toUpperCase() === emailVerificationCode) {
            // Verification successful
            const updatedUser = {
                ...user,
                isVerified: true,
                emailVerified: true
            }

            onUpdateUser(updatedUser)
            setShowEmailVerificationDialog(false)
            setEmailVerificationCode('')
            setEmailVerificationError('')
            setEmailVerificationSent(false)

            // Show success message
            setTimeout(() => {
                setEmailVerificationError('Email verified successfully! ✅')
                setTimeout(() => setEmailVerificationError(''), 3000)
            }, 500)
        } else {
            setEmailVerificationError('Invalid verification code. Please check your email.')
        }
    }

    const handleDeleteAccount = () => {
        // Verify user typed "DELETE"
        if (deleteConfirmText.toUpperCase() !== 'DELETE') {
            setVerificationError('Please type "DELETE" to confirm account deletion')
            return
        }

        // Get all registered users from localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('musicMoodUsers') || '[]')

        // Remove current user from the list
        const updatedUsers = registeredUsers.filter(u => u.email !== user?.email)

        // Update localStorage with remaining users
        localStorage.setItem('musicMoodUsers', JSON.stringify(updatedUsers))

        // Remove current user session
        localStorage.removeItem('musicMoodUser')

        console.log('✅ Account permanently deleted for:', user?.email)
        console.log('⚠️ User can re-register with the same email')

        // Close all dialogs
        setShowDeleteConfirm(false)
        setDeleteConfirmText('')

        // Logout and redirect to login page
        if (onLogout) {
            onLogout()
        } else {
            // Fallback if onLogout is not provided
            onClose()
        }
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
                        <div className="profile-gender-verified-row">
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
                                <motion.button
                                    className="verify-email-btn"
                                    onClick={() => {
                                        setShowEmailVerificationDialog(true)
                                        setEmailVerificationError('')
                                        setEmailVerificationCode('')
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ marginTop: '1rem', padding: '12px 16px', width: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>✅</span>
                                    <span>Enter Verification Code</span>
                                </motion.button>
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
                                                            padding: '12px 16px',
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
                                                            padding: '12px 16px',
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
                                                        padding: '12px 16px',
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
                                        {user?.isVerified && user?.verificationCode && (
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

                        {/* Delete Account Section */}
                        <motion.div
                            className="profile-section"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                        >
                            <motion.button
                                className={`section-toggle danger ${expandedSection === 'delete' ? 'active' : ''}`}
                                onClick={() => toggleSection('delete')}
                                whileHover={{ backgroundColor: 'rgba(255, 107, 107, 0.05)' }}
                            >
                                <span className="toggle-icon">🗑️</span>
                                <span className="toggle-title" style={{ color: '#ff6b6b' }}>Delete Account</span>
                                <span className={`toggle-arrow ${expandedSection === 'delete' ? 'open' : ''}`}>›</span>
                            </motion.button>

                            <AnimatePresence>
                                {expandedSection === 'delete' && (
                                    <motion.div
                                        className="section-content"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div style={{
                                            background: 'rgba(255, 107, 107, 0.08)',
                                            border: '1px solid rgba(255, 107, 107, 0.3)',
                                            borderRadius: '8px',
                                            padding: '1rem',
                                            marginBottom: '1rem'
                                        }}>
                                            <p style={{ color: '#ff6b6b', fontWeight: '600', margin: '0 0 0.5rem' }}>
                                                ⚠️ Warning: This action cannot be undone
                                            </p>
                                            <p style={{ color: '#b0b0b0', margin: '0', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                                Deleting your account will permanently remove all your profile data. However, you can re-register with the same email address anytime.
                                            </p>
                                        </div>

                                        <motion.button
                                            onClick={() => setShowDeleteConfirm(true)}
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
                                            🗑️ Delete My Account
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

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

                {/* Delete Confirmation Dialog */}
                <AnimatePresence>
                    {showDeleteConfirm && (
                        <motion.div
                            className="conflict-dialog-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setShowDeleteConfirm(false)}
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
                                <div className="dialog-header" style={{ borderBottomColor: 'rgba(255, 107, 107, 0.3)' }}>
                                    <span className="dialog-icon" style={{ fontSize: '2rem' }}>⚠️</span>
                                    <h3 style={{ color: '#ff6b6b' }}>Delete Account</h3>
                                    <p>This action is permanent and cannot be undone.</p>
                                </div>

                                <div style={{ padding: '2rem' }}>
                                    <div style={{
                                        background: 'rgba(255, 107, 107, 0.08)',
                                        border: '1px solid rgba(255, 107, 107, 0.3)',
                                        borderRadius: '8px',
                                        padding: '1rem',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <p style={{ color: '#ff6b6b', fontWeight: '600', margin: '0 0 0.5rem' }}>What will happen:</p>
                                        <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.5rem', color: '#b0b0b0', fontSize: '0.9rem' }}>
                                            <li>Your profile data will be permanently deleted</li>
                                            <li>Login history and preferences will be removed</li>
                                            <li>You can re-register with the same email anytime</li>
                                        </ul>
                                    </div>

                                    <p style={{ color: '#b0b0b0', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                        To confirm, type <strong>DELETE</strong> in the field below:
                                    </p>

                                    <input
                                        type="text"
                                        placeholder='Type "DELETE" to confirm'
                                        value={deleteConfirmText}
                                        onChange={(e) => {
                                            setDeleteConfirmText(e.target.value)
                                            setVerificationError('')
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 107, 107, 0.3)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            marginBottom: '1rem',
                                            fontSize: '1rem'
                                        }}
                                    />

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

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <motion.button
                                            onClick={handleDeleteAccount}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                background: 'rgba(255, 107, 107, 0.3)',
                                                border: '1px solid rgba(255, 107, 107, 0.5)',
                                                borderRadius: '8px',
                                                color: '#ff6b6b',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                        >
                                            🗑️ Delete My Account
                                        </motion.button>
                                        <motion.button
                                            onClick={() => {
                                                setShowDeleteConfirm(false)
                                                setDeleteConfirmText('')
                                                setVerificationError('')
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                background: 'rgba(124, 77, 255, 0.2)',
                                                border: '1px solid rgba(124, 77, 255, 0.5)',
                                                borderRadius: '8px',
                                                color: '#7c4dff',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                        >
                                            ❌ Cancel
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Email Verification Dialog */}
                <AnimatePresence>
                    {showEmailVerificationDialog && (
                        <motion.div
                            className="profile-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setShowEmailVerificationDialog(false)}
                        >
                            <motion.div
                                className="profile-dialog"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ duration: 0.2 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 style={{ margin: '0 0 1rem', color: '#7c4dff', textAlign: 'center' }}>✅ Verify Your Email</h3>

                                {emailVerificationError && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        style={{
                                            background: emailVerificationError.includes('successfully') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                                            border: emailVerificationError.includes('successfully') ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(255, 107, 107, 0.3)',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            marginBottom: '1rem',
                                            color: emailVerificationError.includes('successfully') ? '#4caf50' : '#ff6b6b',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <span>{emailVerificationError}</span>
                                    </motion.div>
                                )}

                                <p style={{ margin: '0 0 1rem', color: '#aaa', fontSize: '0.9rem', textAlign: 'center' }}>
                                    📧 A verification code has been sent to <strong>{user?.email}</strong>
                                </p>

                                <input
                                    type="text"
                                    placeholder="Enter 6-digit verification code"
                                    value={emailVerificationCode}
                                    onChange={(e) => setEmailVerificationCode(e.target.value.toUpperCase())}
                                    maxLength="6"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(124, 77, 255, 0.3)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '1.2rem',
                                        textAlign: 'center',
                                        letterSpacing: '2px',
                                        marginBottom: '1.5rem',
                                        fontFamily: 'monospace'
                                    }}
                                />

                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <motion.button
                                        onClick={handleVerifyEmail}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            background: 'linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                    >
                                        ✅ Verify
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setShowEmailVerificationDialog(false)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            background: 'rgba(124, 77, 255, 0.1)',
                                            border: '1px solid rgba(124, 77, 255, 0.3)',
                                            borderRadius: '8px',
                                            color: '#7c4dff',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                    >
                                        ❌ Cancel
                                    </motion.button>
                                </div>
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
    onUpdateUser: PropTypes.func.isRequired,
    onLogout: PropTypes.func
}
