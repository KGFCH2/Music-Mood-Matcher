import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import emailjs from '@emailjs/browser'
import './login.css'

export default function Login({ onLoginSuccess }) {
    const [isSignIn, setIsSignIn] = useState(false)
    const [registerData, setRegisterData] = useState({ email: '', userName: '', gender: 'other' })
    const [signInEmail, setSignInEmail] = useState('')
    const [registeredUsers, setRegisteredUsers] = useState([])
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showConflictDialog, setShowConflictDialog] = useState(false)
    const [existingUser, setExistingUser] = useState(null)
    const [verificationDialogEmail, setVerificationDialogEmail] = useState('')
    const [showVerificationDialog, setShowVerificationDialog] = useState(false)
    const [verificationInputCode, setVerificationInputCode] = useState('')
    const [verificationError, setVerificationError] = useState('')

    // Initialize EmailJS
    useEffect(() => {
        emailjs.init('DXAsSF0A0vz2XPyFm') // Public key
    }, [])

    // Load registered users from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('musicMoodUsers')
            if (saved) {
                setRegisteredUsers(JSON.parse(saved))
            }
        } catch (err) {
            console.error('Error loading users:', err)
        }
    }, [])

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const sendVerificationEmail = async (email, userName, verificationCode) => {
        try {
            // ============================================
            // EMAILJS CONFIGURATION - UPDATE THESE VALUES
            // ============================================
            const SERVICE_ID = 'service_musicmood'      // Your EmailJS Service ID
            const TEMPLATE_ID = 'template_verification' // Your EmailJS Template ID
            // PUBLIC_KEY is already initialized above

            // Email template variables that will be used in EmailJS template
            const templateParams = {
                to_email: email,
                user_name: userName,
                verification_code: verificationCode,
                app_url: window.location.origin
            }

            console.log('📧 Attempting to send verification email...')
            console.log('Email to:', email)
            console.log('Service ID:', SERVICE_ID)
            console.log('Template ID:', TEMPLATE_ID)

            const response = await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                templateParams
            )

            console.log('✅ Email sent successfully!')
            console.log('EmailJS Response:', response)
            return true

        } catch (error) {
            console.error('❌ Error sending email:', error)
            
            // Check if it's a configuration error
            if (error.status === 400 || error.text?.includes('Invalid service ID') || error.text?.includes('Invalid template ID')) {
                console.error('\n🔧 SETUP REQUIRED:')
                console.error('Your EmailJS service or template is not configured correctly.')
                console.error('Please follow the EMAIL_SETUP.md guide in the frontend folder.')
                console.error('\nQuick steps:')
                console.error('1. Visit https://www.emailjs.com/')
                console.error('2. Create a service with ID: service_musicmood')
                console.error('3. Create a template with ID: template_verification')
                console.error('4. Add these template variables: {{to_email}}, {{user_name}}, {{verification_code}}')
                console.error('\nThe verification code is: ' + verificationCode)
                alert(
                    '❌ Email service not configured.\n\n' +
                    'To enable real email verification:\n\n' +
                    '1. Go to emailjs.com and create a free account\n' +
                    '2. Add your email service (Gmail, Outlook, etc.)\n' +
                    '3. Create a template named "template_verification"\n' +
                    '4. Use variables: {{to_email}}, {{user_name}}, {{verification_code}}\n' +
                    '5. Check EMAIL_SETUP.md in the frontend folder for detailed steps\n\n' +
                    'For now, your verification code is: ' + verificationCode
                )
            } else {
                // Other network or unexpected errors
                console.error('Unexpected error:', error.message)
                alert('Error sending email. Please try again.')
            }
            
            return false
        }
    }

    const generateVerificationCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase()
    }

    const handleRegister = (e) => {
        e.preventDefault()
        setError('')

        if (!registerData.userName.trim()) {
            setError('Please enter your name')
            return
        }

        if (!registerData.email.trim()) {
            setError('Please enter your email address')
            return
        }

        if (!validateEmail(registerData.email)) {
            setError('Please enter a valid email address')
            return
        }

        if (!registerData.gender) {
            setError('Please select your gender')
            return
        }

        // Check if email already registered
        const existing = registeredUsers.find(u => u.email === registerData.email)
        if (existing) {
            if (existing.userName !== registerData.userName || existing.gender !== registerData.gender) {
                setExistingUser(existing)
                setShowConflictDialog(true)
                return
            } else {
                setError('This email is already registered. Please sign in instead.')
                return
            }
        }

        setIsLoading(true)

        setTimeout(async () => {
            // Generate verification code first
            const verificationCode = generateVerificationCode()

            // Try to send email
            await sendVerificationEmail(
                registerData.email,
                registerData.userName,
                verificationCode
            )

            const userData = {
                email: registerData.email,
                userName: registerData.userName,
                gender: registerData.gender,
                userId: Math.random().toString(36).substr(2, 9),
                registeredAt: new Date().toISOString(),
                loginHistory: [new Date().toISOString()],
                isVerified: false,
                verificationCode: verificationCode
            }

            // Save new user to registered users list
            const updatedUsers = [...registeredUsers, userData]
            setRegisteredUsers(updatedUsers)
            localStorage.setItem('musicMoodUsers', JSON.stringify(updatedUsers))

            setIsLoading(false)
            // Show verification dialog instead of logging in directly
            setVerificationDialogEmail(registerData.email)
            setShowVerificationDialog(true)
            setVerificationInputCode('')
            setVerificationError('')
            setRegisterData({ email: '', userName: '', gender: 'other' })
        }, 1000)
    }

    const handleSignIn = (e) => {
        e.preventDefault()
        setError('')

        if (!signInEmail.trim()) {
            setError('Please enter your email address')
            return
        }

        if (!validateEmail(signInEmail)) {
            setError('Please enter a valid email address')
            return
        }

        // Find user by email
        const user = registeredUsers.find(u => u.email === signInEmail)
        if (!user) {
            setError('Email not found. Please register first.')
            return
        }

        setIsLoading(true)

        setTimeout(() => {
            // Check if user is verified
            if (!user.isVerified) {
                setIsLoading(false)
                setVerificationDialogEmail(signInEmail)
                setShowVerificationDialog(true)
                setVerificationInputCode('')
                setVerificationError('')
                setSignInEmail('')
                return
            }

            // Update login history
            const updatedUser = {
                ...user,
                loginHistory: [...(user.loginHistory || []), new Date().toISOString()]
            }

            // Update in registered users list
            const updatedUsers = registeredUsers.map(u =>
                u.email === signInEmail ? updatedUser : u
            )
            setRegisteredUsers(updatedUsers)
            localStorage.setItem('musicMoodUsers', JSON.stringify(updatedUsers))

            // Save current user session
            localStorage.setItem('musicMoodUser', JSON.stringify(updatedUser))

            setIsLoading(false)
            onLoginSuccess(updatedUser)
        }, 1000)
    }

    const handleVerifyEmail = (e) => {
        e.preventDefault()
        setVerificationError('')

        if (!verificationInputCode.trim()) {
            setVerificationError('Please enter the verification code')
            return
        }

        // Find the user by email
        const user = registeredUsers.find(u => u.email === verificationDialogEmail)
        if (!user) {
            setVerificationError('User not found')
            return
        }

        // Check if verification code matches
        if (verificationInputCode.toUpperCase() === user.verificationCode) {
            // Mark user as verified
            const verifiedUser = {
                ...user,
                isVerified: true
            }

            // Update in registered users list
            const updatedUsers = registeredUsers.map(u =>
                u.email === verificationDialogEmail ? verifiedUser : u
            )
            setRegisteredUsers(updatedUsers)
            localStorage.setItem('musicMoodUsers', JSON.stringify(updatedUsers))

            // Save current user session
            localStorage.setItem('musicMoodUser', JSON.stringify(verifiedUser))

            setShowVerificationDialog(false)
            setVerificationInputCode('')
            onLoginSuccess(verifiedUser)
        } else {
            setVerificationError('Invalid verification code. Please check your email and try again.')
        }
    }

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="musical-note note-1">♪</div>
                <div className="musical-note note-2">♫</div>
                <div className="musical-note note-3">🎵</div>
                <div className="musical-note note-4">♪</div>
                <div className="musical-note note-5">♫</div>
                <div className="musical-note note-6">🎶</div>
            </div>

            <motion.div
                className="login-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                {/* Animated Header */}
                <motion.div
                    className="login-header"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="header-icon">🎵</div>
                    <h1>Music Mood Matcher</h1>
                    <p className="header-subtitle">Find Your Perfect Song</p>
                </motion.div>

                {/* Tab Toggle */}
                <div className="auth-tabs">
                    <motion.button
                        className={`tab-btn ${!isSignIn ? 'active' : ''}`}
                        onClick={() => {
                            setIsSignIn(false)
                            setError('')
                            setSignInEmail('')
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="tab-emoji">✨</span>
                        <span className="tab-name">Register</span>
                    </motion.button>
                    <motion.button
                        className={`tab-btn ${isSignIn ? 'active' : ''}`}
                        onClick={() => {
                            setIsSignIn(true)
                            setError('')
                            setRegisterData({ email: '', userName: '' })
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="tab-emoji">🔑</span>
                        <span className="tab-name">Sign In</span>
                    </motion.button>
                </div>

                {/* Sliding Forms Container */}
                <div className="forms-container">
                    <AnimatePresence mode="wait">
                        {/* Register Form */}
                        {!isSignIn && (
                            <motion.form
                                key="register"
                                className="auth-form"
                                onSubmit={handleRegister}
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        className="error-message"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <span className="error-icon">⚠️</span>
                                        <span className="error-text">{error}</span>
                                    </motion.div>
                                )}

                                {/* Name Input */}
                                <motion.div
                                    className="form-group"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1, duration: 0.4 }}
                                >
                                    <label htmlFor="registerName">
                                        <span className="label-icon">🎤</span>
                                        <span className="label-text">Your Name</span>
                                    </label>
                                    <input
                                        id="registerName"
                                        type="text"
                                        placeholder="Enter your name"
                                        value={registerData.userName}
                                        onChange={(e) =>
                                            setRegisterData({ ...registerData, userName: e.target.value })
                                        }
                                        disabled={isLoading}
                                        className="form-input"
                                    />
                                </motion.div>

                                {/* Email Input */}
                                <motion.div
                                    className="form-group"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                >
                                    <label htmlFor="registerEmail">
                                        <span className="label-icon">📧</span>
                                        <span className="label-text">Email Address</span>
                                    </label>
                                    <input
                                        id="registerEmail"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={registerData.email}
                                        onChange={(e) =>
                                            setRegisterData({ ...registerData, email: e.target.value })
                                        }
                                        disabled={isLoading}
                                        className="form-input"
                                    />
                                </motion.div>

                                {/* Gender Selection */}
                                <motion.div
                                    className="form-group"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.25, duration: 0.4 }}
                                >
                                    <label className="gender-label">
                                        <span className="label-icon">✨</span>
                                        <span className="label-text">Select Gender</span>
                                    </label>
                                    <div className="gender-options">
                                        <motion.button
                                            key="male"
                                            type="button"
                                            className={`gender-btn ${registerData.gender === 'male' ? 'active' : ''}`}
                                            onClick={() => setRegisterData({ ...registerData, gender: 'male' })}
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <motion.span 
                                                key={`male-icon-${registerData.gender === 'male'}`}
                                                className="gender-icon"
                                                animate={{ scale: registerData.gender === 'male' ? 1.3 : 1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                👨
                                            </motion.span>
                                            <span className="gender-text">Male</span>
                                        </motion.button>
                                        <motion.button
                                            key="female"
                                            type="button"
                                            className={`gender-btn ${registerData.gender === 'female' ? 'active' : ''}`}
                                            onClick={() => setRegisterData({ ...registerData, gender: 'female' })}
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <motion.span 
                                                key={`female-icon-${registerData.gender === 'female'}`}
                                                className="gender-icon"
                                                animate={{ scale: registerData.gender === 'female' ? 1.3 : 1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                👩
                                            </motion.span>
                                            <span className="gender-text">Female</span>
                                        </motion.button>
                                        <motion.button
                                            key="other"
                                            type="button"
                                            className={`gender-btn ${registerData.gender === 'other' ? 'active' : ''}`}
                                            onClick={() => setRegisterData({ ...registerData, gender: 'other' })}
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <motion.span 
                                                key={`other-icon-${registerData.gender === 'other'}`}
                                                className="gender-icon"
                                                animate={{ scale: registerData.gender === 'other' ? 1.3 : 1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                👤
                                            </motion.span>
                                            <span className="gender-text">Other</span>
                                        </motion.button>
                                    </div>
                                </motion.div>

                                {/* Submit Button */}
                                <motion.button
                                    className="login-btn"
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner"></span>
                                            <span className="btn-text">Sending Verification Email...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="btn-icon">🎶</span>
                                            <span className="btn-text">Start Your Journey</span>
                                        </>
                                    )}
                                </motion.button>
                            </motion.form>
                        )}

                        {/* Sign In Form */}
                        {isSignIn && (
                            <motion.form
                                key="signin"
                                className="auth-form"
                                onSubmit={handleSignIn}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        className="error-message"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <span className="error-icon">⚠️</span>
                                        <span className="error-text">{error}</span>
                                    </motion.div>
                                )}

                                {/* Email Input */}
                                <motion.div
                                    className="form-group"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1, duration: 0.4 }}
                                >
                                    <label htmlFor="signinEmail">
                                        <span className="label-icon">📧</span>
                                        <span className="label-text">Email Address</span>
                                    </label>
                                    <input
                                        id="signinEmail"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={signInEmail}
                                        onChange={(e) => setSignInEmail(e.target.value)}
                                        disabled={isLoading}
                                        className="form-input"
                                    />
                                </motion.div>

                                {/* Info Message */}
                                <motion.p
                                    className="signin-info"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                >
                                    <span className="info-icon">ℹ️</span>
                                    <span className="info-text">Enter your registered email to continue</span>
                                </motion.p>

                                {/* Submit Button */}
                                <motion.button
                                    className="login-btn"
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner"></span>
                                            <span className="btn-text">Signing In...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="btn-icon">🔑</span>
                                            <span className="btn-text">Welcome Back</span>
                                        </>
                                    )}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                {/* Conflict Dialog */}
                <AnimatePresence>
                    {showConflictDialog && existingUser && (
                        <motion.div
                            className="conflict-dialog-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="conflict-dialog"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="dialog-header">
                                    <span className="dialog-icon">⚠️</span>
                                    <h3>Email Already Registered</h3>
                                    <p>This email is already registered with different details. Please choose which information to keep:</p>
                                </div>

                                <div className="conflict-options">
                                    <div className="user-option existing">
                                        <h4>Existing User Details</h4>
                                        <div className="user-details">
                                            <p><strong>Name:</strong> {existingUser.userName}</p>
                                            <p><strong>Gender:</strong> {existingUser.gender}</p>
                                            <p><strong>Email:</strong> {existingUser.email}</p>
                                        </div>
                                        <motion.button
                                            className="option-btn keep-existing"
                                            onClick={() => {
                                                // Keep existing user details
                                                localStorage.setItem('musicMoodUser', JSON.stringify(existingUser))
                                                setShowConflictDialog(false)
                                                onLoginSuccess(existingUser)
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className="btn-icon">✅</span>
                                            <span className="btn-text">Keep Existing</span>
                                        </motion.button>
                                    </div>

                                    <div className="user-option new">
                                        <h4>New User Details</h4>
                                        <div className="user-details">
                                            <p><strong>Name:</strong> {registerData.userName}</p>
                                            <p><strong>Gender:</strong> {registerData.gender}</p>
                                            <p><strong>Email:</strong> {registerData.email}</p>
                                        </div>
                                        <motion.button
                                            className="option-btn use-new"
                                            onClick={() => {
                                                // Update user with new details
                                                const updatedUser = {
                                                    ...existingUser,
                                                    userName: registerData.userName,
                                                    gender: registerData.gender
                                                }
                                                const updatedUsers = registeredUsers.map(u =>
                                                    u.email === registerData.email ? updatedUser : u
                                                )
                                                setRegisteredUsers(updatedUsers)
                                                localStorage.setItem('musicMoodUsers', JSON.stringify(updatedUsers))
                                                localStorage.setItem('musicMoodUser', JSON.stringify(updatedUser))
                                                setShowConflictDialog(false)
                                                onLoginSuccess(updatedUser)
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className="btn-icon">🔄</span>
                                            <span className="btn-text">Use New Details</span>
                                        </motion.button>
                                    </div>
                                </div>

                                <motion.button
                                    className="cancel-btn"
                                    onClick={() => {
                                        setShowConflictDialog(false)
                                        setExistingUser(null)
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="btn-icon">❌</span>
                                    <span className="btn-text">Cancel</span>
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Verification Dialog */}
                <AnimatePresence>
                    {showVerificationDialog && (
                        <motion.div
                            className="conflict-dialog-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="conflict-dialog"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="dialog-header">
                                    <span className="dialog-icon">📧</span>
                                    <h3>Verify Your Email</h3>
                                    <p>A verification code has been sent to <strong>{verificationDialogEmail}</strong></p>
                                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#b0b0b0' }}>Please enter the code from your email to complete registration.</p>

                                    {/* Verification Code Display */}
                                    {registeredUsers.find(u => u.email === verificationDialogEmail) && (
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
                                                {registeredUsers.find(u => u.email === verificationDialogEmail)?.verificationCode}
                                            </p>
                                            <p style={{ margin: '1rem 0 0', fontSize: '0.8rem', color: '#888', lineHeight: '1.8', textAlign: 'left' }}>
                                                <strong>💡 Setup Instructions:</strong><br />
                                                Real emails are not sent yet because EmailJS is not configured.<br />
                                                <br />
                                                <strong>To enable real email sending:</strong><br />
                                                1. Read <code style={{ background: '#222', padding: '2px 6px', borderRadius: '3px' }}>EMAIL_SETUP.md</code> in frontend folder<br />
                                                2. Visit <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#00e5ff', textDecoration: 'none' }}>emailjs.com</a> (free)<br />
                                                3. Create service: <code style={{ background: '#222', padding: '2px 6px', borderRadius: '3px' }}>service_musicmood</code><br />
                                                4. Create template: <code style={{ background: '#222', padding: '2px 6px', borderRadius: '3px' }}>template_verification</code><br />
                                                5. Use code above when ready ✅
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleVerifyEmail} style={{ padding: '2rem' }}>
                                    {verificationError && (
                                        <motion.div
                                            className="error-message"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <span className="error-icon">⚠️</span>
                                            <span className="error-text">{verificationError}</span>
                                        </motion.div>
                                    )}

                                    <motion.div
                                        className="form-group"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1, duration: 0.4 }}
                                    >
                                        <label htmlFor="verificationCode">
                                            <span className="label-icon">🔐</span>
                                            <span className="label-text">Verification Code</span>
                                        </label>
                                        <input
                                            id="verificationCode"
                                            type="text"
                                            placeholder="Enter 6-digit code"
                                            value={verificationInputCode}
                                            onChange={(e) => setVerificationInputCode(e.target.value.toUpperCase())}
                                            maxLength="6"
                                            className="form-input"
                                            style={{ letterSpacing: '2px', textAlign: 'center', fontSize: '1.2rem' }}
                                        />
                                    </motion.div>

                                    <motion.button
                                        className="login-btn"
                                        type="submit"
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.4 }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <span className="btn-icon">✅</span>
                                            <span className="btn-text">Verify Email</span>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        className="cancel-btn"
                                        type="button"
                                        onClick={() => {
                                            setShowVerificationDialog(false)
                                            setVerificationInputCode('')
                                            setVerificationError('')
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{ marginTop: '1rem' }}
                                    >
                                        <span className="btn-icon">❌</span>
                                        <span className="btn-text">Cancel</span>
                                    </motion.button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </div>
    )
}

Login.propTypes = {
    onLoginSuccess: PropTypes.func.isRequired
}
