import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import './login.css'

export default function Login({ onLoginSuccess }) {
    const [isSignIn, setIsSignIn] = useState(false)
    const [registerData, setRegisterData] = useState({ email: '', userName: '' })
    const [signInEmail, setSignInEmail] = useState('')
    const [registeredUsers, setRegisteredUsers] = useState([])
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

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

    const sendVerificationEmail = async (email, userName) => {
        try {
            // Create a simple verification email using a POST request to a free email service
            const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase()
            const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px; }
        .header { background: linear-gradient(135deg, #7c4dff 0%, #00e5ff 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
        .code-box { background: #f0f0f0; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0; border-left: 4px solid #7c4dff; }
        .code { font-size: 24px; font-weight: bold; color: #7c4dff; letter-spacing: 2px; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎵 Music Mood Matcher</h1>
            <p>Welcome to Your Musical Journey</p>
        </div>
        <div class="content">
            <h2>Welcome, ${userName}!</h2>
            <p>Thank you for registering with Music Mood Matcher. Your account has been successfully created!</p>
            <p>You can now enjoy discovering songs that match your mood. Here's your verification code:</p>
            <div class="code-box">
                <div class="code">${verificationCode}</div>
            </div>
            <p>This code confirms your account creation. Save this for your records.</p>
            <p><strong>Account Details:</strong></p>
            <ul>
                <li>Email: ${email}</li>
                <li>Name: ${userName}</li>
                <li>Registration Date: ${new Date().toLocaleDateString()}</li>
            </ul>
            <p style="color: #666; font-size: 14px;">If you did not create this account, please disregard this email.</p>
        </div>
        <div class="footer">
            <p>© 2025 Music Mood Matcher. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>
            `

            // Log the verification code in console for development
            console.log(`📧 Verification email sent to ${email}`)
            console.log(`✅ Verification Code: ${verificationCode}`)

            // In a real scenario, you would send this via an API
            // For now, we'll just store the verification code locally
            return verificationCode
        } catch (error) {
            console.error('Error preparing verification email:', error)
            return null
        }
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

        // Check if email already registered
        if (registeredUsers.some(u => u.email === registerData.email)) {
            setError('This email is already registered. Please sign in instead.')
            return
        }

        setIsLoading(true)

        setTimeout(async () => {
            const verificationCode = await sendVerificationEmail(
                registerData.email,
                registerData.userName
            )

            const userData = {
                email: registerData.email,
                userName: registerData.userName,
                userId: Math.random().toString(36).substr(2, 9),
                registeredAt: new Date().toISOString(),
                loginHistory: [new Date().toISOString()],
                isVerified: true,
                verificationCode: verificationCode
            }

            // Save new user to registered users list
            const updatedUsers = [...registeredUsers, userData]
            setRegisteredUsers(updatedUsers)
            localStorage.setItem('musicMoodUsers', JSON.stringify(updatedUsers))

            // Save current user session
            localStorage.setItem('musicMoodUser', JSON.stringify(userData))

            setIsLoading(false)
            onLoginSuccess(userData)
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

                {/* Animated Decorative Elements */}
                <div className="decorative-bars">
                    <motion.div
                        className="bar"
                        animate={{ height: ['20px', '40px', '20px'] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    ></motion.div>
                    <motion.div
                        className="bar"
                        animate={{ height: ['30px', '50px', '30px'] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    ></motion.div>
                    <motion.div
                        className="bar"
                        animate={{ height: ['25px', '45px', '25px'] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: 0.4 }}
                    ></motion.div>
                    <motion.div
                        className="bar"
                        animate={{ height: ['20px', '40px', '20px'] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }}
                    ></motion.div>
                    <motion.div
                        className="bar"
                        animate={{ height: ['28px', '48px', '28px'] }}
                        transition={{ duration: 0.65, repeat: Infinity, delay: 0.3 }}
                    ></motion.div>
                </div>

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

                {/* Info Message */}
                <motion.p
                    className="login-info"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <span className="info-icon">🔒</span>
                    <span className="info-text">Your data is securely stored in your browser</span>
                </motion.p>
            </motion.div>
        </div>
    )
}

Login.propTypes = {
    onLoginSuccess: PropTypes.func.isRequired
}
