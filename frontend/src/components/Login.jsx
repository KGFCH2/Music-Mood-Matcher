import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import emailjs from '@emailjs/browser'
import DemoGuide from './DemoGuide'
import { secureStorage } from '../utils/secureStorage'
import { hashPassword, validatePasswordStrength, getPasswordFeedback } from '../utils/passwordUtils'
import './login.css'

export default function Login({ onLoginSuccess }) {
    const [isSignIn, setIsSignIn] = useState(false)
    const [registerData, setRegisterData] = useState({ email: '', userName: '', gender: 'other', password: '', confirmPassword: '' })
    const [signInEmail, setSignInEmail] = useState('')
    const [signInPassword, setSignInPassword] = useState('')
    const [registeredUsers, setRegisteredUsers] = useState([])
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showConflictDialog, setShowConflictDialog] = useState(false)
    const [existingUser, setExistingUser] = useState(null)
    const [verificationDialogEmail, setVerificationDialogEmail] = useState('')
    const [showVerificationDialog, setShowVerificationDialog] = useState(false)
    const [verificationInputCode, setVerificationInputCode] = useState('')
    const [verificationError, setVerificationError] = useState('')
    const [showDemoGuide, setShowDemoGuide] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [emailSentSuccess, setEmailSentSuccess] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)
    const [emailValidation, setEmailValidation] = useState({ isValid: null, message: '' })
    const [nameValidation, setNameValidation] = useState({ isValid: null, message: '' })
    const [passwordValidation, setPasswordValidation] = useState({ isValid: null, message: '', color: '' })
    const [confirmPasswordValidation, setConfirmPasswordValidation] = useState({ isValid: null, message: '' })
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showSignInPassword, setShowSignInPassword] = useState(false)

    // Demo credentials
    const DEMO_USERS = [
        { email: 'demo.music.lover@example.com', name: 'Music Lover', gender: 'male' },
        { email: 'demo.happy.vibes@example.com', name: 'Happy Vibes', gender: 'female' },
        { email: 'demo.chill.mode@example.com', name: 'Chill Mode', gender: 'other' }
    ]

    // Ref for auto-focus on verification input
    const verificationInputRef = React.useRef(null)

    // Initialize EmailJS
    useEffect(() => {
        emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'yvSwGRuksv7zAychI') // Public key from env
    }, [])

    // Cooldown timer for resend button
    useEffect(() => {
        let timer
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown(prev => prev - 1)
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [resendCooldown])

    // Auto-focus verification input when dialog opens
    useEffect(() => {
        if (showVerificationDialog && verificationInputRef.current) {
            setTimeout(() => verificationInputRef.current?.focus(), 100)
        }
    }, [showVerificationDialog])

    // Load registered users from secure storage on mount
    useEffect(() => {
        try {
            const saved = secureStorage.getRegisteredUsers()
            if (saved && Array.isArray(saved)) {
                setRegisteredUsers(saved)
            }
        } catch (err) {
            // Silent fail - don't expose errors
            setRegisteredUsers([])
        }
    }, [])

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    // Real-time email validation
    const handleEmailChange = (email) => {
        setRegisterData({ ...registerData, email })
        if (!email.trim()) {
            setEmailValidation({ isValid: null, message: '' })
        } else if (validateEmail(email)) {
            const existing = registeredUsers.find(u => u.email === email)
            if (existing) {
                setEmailValidation({ isValid: false, message: 'Email already registered' })
            } else {
                setEmailValidation({ isValid: true, message: 'Email looks good!' })
            }
        } else {
            setEmailValidation({ isValid: false, message: 'Invalid email format' })
        }
    }

    // Real-time name validation
    const handleNameChange = (name) => {
        setRegisterData({ ...registerData, userName: name })
        if (!name.trim()) {
            setNameValidation({ isValid: null, message: '' })
        } else if (name.trim().length < 2) {
            setNameValidation({ isValid: false, message: 'Name too short' })
        } else if (name.trim().length > 50) {
            setNameValidation({ isValid: false, message: 'Name too long' })
        } else {
            setNameValidation({ isValid: true, message: 'Name looks good!' })
        }
    }

    // Real-time password validation
    const handlePasswordChange = (password) => {
        setRegisterData({ ...registerData, password })
        if (!password.trim()) {
            setPasswordValidation({ isValid: null, message: '', color: '' })
        } else {
            const { isStrong, requirements, strengthLevel } = validatePasswordStrength(password)
            const feedback = getPasswordFeedback(password)
            setPasswordValidation({
                isValid: isStrong,
                message: feedback.message,
                color: feedback.color
            })
        }
        // Check confirm password match if filled
        if (registerData.confirmPassword) {
            validateConfirmPassword(registerData.confirmPassword, password)
        }
    }

    // Confirm password validation
    const handleConfirmPasswordChange = (confirmPassword) => {
        setRegisterData({ ...registerData, confirmPassword })
        validateConfirmPassword(confirmPassword, registerData.password)
    }

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword.trim()) {
            setConfirmPasswordValidation({ isValid: null, message: '' })
        } else if (confirmPassword !== password) {
            setConfirmPasswordValidation({ isValid: false, message: 'Passwords do not match' })
        } else {
            setConfirmPasswordValidation({ isValid: true, message: 'Passwords match!' })
        }
    }

    // Auto-submit when verification code is complete
    const handleVerificationCodeChange = (value) => {
        const code = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
        setVerificationInputCode(code)

        // Auto-submit when 6 characters entered
        if (code.length === 6) {
            setTimeout(() => {
                const user = registeredUsers.find(u => u.email === verificationDialogEmail)
                if (user && code === user.verificationCode) {
                    handleAutoVerify(code)
                }
            }, 300)
        }
    }

    // Auto-verify handler
    const handleAutoVerify = (code) => {
        const user = registeredUsers.find(u => u.email === verificationDialogEmail)
        if (!user) return

        if (code === user.verificationCode) {
            setShowSuccessAnimation(true)

            const verifiedUser = {
                email: user.email,
                userName: user.userName,
                gender: user.gender,
                userId: user.userId,
                registeredAt: user.registeredAt,
                isVerified: true,
                isDemo: user.isDemo || false
            }

            const updatedUsers = registeredUsers.map(u =>
                u.email === verificationDialogEmail ? verifiedUser : u
            )
            setRegisteredUsers(updatedUsers)
            // Use secure storage - don't store verification code
            secureStorage.setRegisteredUsers(updatedUsers)
            secureStorage.setUserInfo(verifiedUser)

            setTimeout(() => {
                setShowVerificationDialog(false)
                setVerificationInputCode('')
                setEmailSentSuccess(false)
                setShowSuccessAnimation(false)
                onLoginSuccess(verifiedUser)
            }, 1500)
        }
    }

    const sendVerificationEmail = async (email, userName, verificationCode) => {
        try {
            // EmailJS Configuration - Uses environment variables with fallbacks
            const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_zfess1e'
            const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_hz19s08'
            const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'yvSwGRuksv7zAychI'

            // Verify email format before sending
            if (!validateEmail(email)) {
                return { success: false, error: 'Invalid email format' }
            }

            // Template variables - IMPORTANT: These must exactly match your EmailJS template
            // Check your EmailJS dashboard to ensure template uses: {{to_email}}, {{user_name}}, {{verification_code}}
            const templateParams = {
                to_email: email,                    // Recipient's registered email
                recipient_email: email,             // Alternative variable name
                email_address: email,               // Alternative variable name
                user_name: userName,                // User's name
                verification_code: verificationCode, // 6-digit code
                code: verificationCode              // Alternative variable name
            }

            // DO NOT LOG SENSITIVE DATA - verification code and email are confidential
            // Only log service status for debugging, never log user data or verification codes
            if (process.env.NODE_ENV === 'development') {
                // Only in development mode, log minimal service info
                console.debug('Email service: Sending verification message')
            }

            const response = await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                templateParams,
                PUBLIC_KEY
            )

            if (process.env.NODE_ENV === 'development') {
                console.debug('Email service: Message sent successfully')
            }
            return { success: true }

        } catch (error) {
            let errorMessage = 'Failed to send verification email. Please try again.'

            // Log specific error codes for debugging (no sensitive data)
            if (error.status === 400) {
                if (process.env.NODE_ENV === 'development') {
                    console.debug('Email service: Invalid request - check template configuration')
                }
                errorMessage = 'Email service configuration error. Please contact support.'
            } else if (error.status === 401) {
                if (process.env.NODE_ENV === 'development') {
                    console.debug('Email service: Authentication failed')
                }
                errorMessage = 'Email service authentication failed. Please contact support.'
            } else if (error.status === 404) {
                if (process.env.NODE_ENV === 'development') {
                    console.debug('Email service: Service not found')
                }
                errorMessage = 'Email service not found. Please contact support.'
            } else if (error.status === 429) {
                if (process.env.NODE_ENV === 'development') {
                    console.debug('Email service: Rate limit exceeded')
                }
                errorMessage = 'Too many email requests. Please wait a moment and try again.'
            }

            return { success: false, error: errorMessage }
        }
    }

    const generateVerificationCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase()
    }

    const handleRegister = async (e) => {
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

        // Validate password
        if (!registerData.password.trim()) {
            setError('Please enter a password')
            return
        }

        const { isStrong } = validatePasswordStrength(registerData.password)
        if (!isStrong) {
            setError('Password does not meet strength requirements')
            return
        }

        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match')
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

        try {
            // Hash password securely
            const hashedPassword = await hashPassword(registerData.password)

            // Generate secure verification code (stored in memory only, never in localStorage)
            const verificationCode = generateVerificationCode()

            // Store the email being registered to prevent accidental email changes
            const registrationEmail = registerData.email
            const registrationName = registerData.userName

            // Create user data object - verification code stored temporarily in memory
            const userData = {
                email: registrationEmail,
                userName: registrationName,
                gender: registerData.gender,
                userId: Math.random().toString(36).substr(2, 9),
                registeredAt: new Date().toISOString(),
                loginHistory: [new Date().toISOString()],
                isVerified: false,
                passwordHash: hashedPassword, // Hash stored in memory only, not in localStorage
                verificationCode: verificationCode, // Temporary - only in memory
                emailVerified: false
            }

            // Send verification email FIRST before saving user
            const emailResult = await sendVerificationEmail(
                registrationEmail,
                registrationName,
                verificationCode
            )

            if (!emailResult.success) {
                setIsLoading(false)
                setError(emailResult.error || 'Failed to send verification email. Please try again.')
                return
            }

            // Save new user to registered users list AFTER email is sent successfully
            // NOTE: Only safe user data stored (no verification code)
            const safeUserData = {
                email: userData.email,
                userName: userData.userName,
                gender: userData.gender,
                userId: userData.userId,
                registeredAt: userData.registeredAt,
                loginHistory: userData.loginHistory,
                isVerified: false,
                isDemo: false
            }

            const updatedUsers = [...registeredUsers, userData] // Keep in-memory with code for immediate use
            setRegisteredUsers(updatedUsers)
            // Only save safe data to persistent storage
            secureStorage.setRegisteredUsers(updatedUsers)

            setIsLoading(false)
            setEmailSentSuccess(true)

            // Show verification dialog with the registered email
            setVerificationDialogEmail(registrationEmail)
            setShowVerificationDialog(true)
            setVerificationInputCode('')
            setVerificationError('')
            setRegisterData({ email: '', userName: '', gender: 'other', password: '', confirmPassword: '' })

            // Do NOT log user registration details or verification codes
            if (process.env.NODE_ENV === 'development') {
                console.debug('Registration: Verification email sent')
            }
        } catch (err) {
            setIsLoading(false)
            setError('An unexpected error occurred. Please try again.')
            // Do NOT log detailed error info that might expose data
            if (process.env.NODE_ENV === 'development') {
                console.debug('Registration error occurred')
            }
        }
    }

    const handleSignIn = async (e) => {
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

        if (!signInPassword.trim()) {
            setError('Please enter your password')
            return
        }

        // Find user by email
        const user = registeredUsers.find(u => u.email === signInEmail)
        if (!user) {
            setError('Email not found. Please register first.')
            return
        }

        setIsLoading(true)

        try {
            // Hash the entered password and compare with stored hash
            const hashedInputPassword = await hashPassword(signInPassword)

            if (hashedInputPassword !== user.passwordHash) {
                setIsLoading(false)
                setError('Invalid password. Please try again.')
                return
            }

            // Password is correct, check if user is verified
            if (!user.isVerified) {
                // Generate new verification code and send email
                const newVerificationCode = generateVerificationCode()

                const emailResult = await sendVerificationEmail(
                    signInEmail,
                    user.userName,
                    newVerificationCode
                )

                // Update user with new verification code (in-memory only)
                const updatedUser = {
                    ...user,
                    verificationCode: newVerificationCode
                }
                const updatedUsers = registeredUsers.map(u =>
                    u.email === signInEmail ? updatedUser : u
                )
                setRegisteredUsers(updatedUsers)
                // Only save safe data to persistent storage
                secureStorage.setRegisteredUsers(updatedUsers)

                setIsLoading(false)
                setVerificationDialogEmail(signInEmail)
                setShowVerificationDialog(true)
                setVerificationInputCode('')
                setVerificationError('')
                setEmailSentSuccess(emailResult.success)
                if (!emailResult.success) {
                    setVerificationError(emailResult.error || 'Failed to send verification email.')
                }
                setSignInEmail('')
                setSignInPassword('')
                return
            }

            // Update login history
            const updatedUser = {
                email: user.email,
                userName: user.userName,
                gender: user.gender,
                userId: user.userId,
                registeredAt: user.registeredAt,
                isVerified: user.isVerified,
                isDemo: user.isDemo || false,
                loginHistory: [...(user.loginHistory || []), new Date().toISOString()]
            }

            // Update in registered users list
            const updatedUsers = registeredUsers.map(u =>
                u.email === signInEmail ? updatedUser : u
            )
            setRegisteredUsers(updatedUsers)
            // Use secure storage instead of localStorage
            secureStorage.setRegisteredUsers(updatedUsers)
            secureStorage.setUserInfo(updatedUser)

            setIsLoading(false)
            onLoginSuccess(updatedUser)
        } catch (err) {
            setIsLoading(false)
            setError('An error occurred during sign-in. Please try again.')
            if (process.env.NODE_ENV === 'development') {
                console.debug('Sign-in error occurred')
            }
        }
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
            // Mark user as verified - only store safe data
            const verifiedUser = {
                email: user.email,
                userName: user.userName,
                gender: user.gender,
                userId: user.userId,
                registeredAt: user.registeredAt,
                isVerified: true,
                isDemo: user.isDemo || false
            }

            // Update in registered users list
            const updatedUsers = registeredUsers.map(u =>
                u.email === verificationDialogEmail ? verifiedUser : u
            )
            setRegisteredUsers(updatedUsers)
            // Use secure storage instead of localStorage
            secureStorage.setRegisteredUsers(updatedUsers)
            secureStorage.setUserInfo(verifiedUser)

            setShowVerificationDialog(false)
            setVerificationInputCode('')
            setEmailSentSuccess(false)
            onLoginSuccess(verifiedUser)
        } else {
            setVerificationError('Invalid verification code. Please check your email and try again.')
        }
    }

    const handleResendCode = async () => {
        if (resendCooldown > 0) return

        setIsResending(true)
        setVerificationError('')

        // Find the user by email
        const user = registeredUsers.find(u => u.email === verificationDialogEmail)
        if (!user) {
            setVerificationError('User not found. Please register again.')
            setIsResending(false)
            return
        }

        // Generate new verification code
        const newVerificationCode = generateVerificationCode()

        // Send new verification email
        const emailResult = await sendVerificationEmail(
            verificationDialogEmail,
            user.userName,
            newVerificationCode
        )

        if (emailResult.success) {
            // Update user with new verification code (in-memory only)
            const updatedUser = {
                ...user,
                verificationCode: newVerificationCode
            }
            const updatedUsers = registeredUsers.map(u =>
                u.email === verificationDialogEmail ? updatedUser : u
            )
            setRegisteredUsers(updatedUsers)
            // Only save safe data to persistent storage
            secureStorage.setRegisteredUsers(updatedUsers)

            setEmailSentSuccess(true)
            setVerificationError('')
            setResendCooldown(60) // 60 second cooldown
            // Do NOT log that verification code was sent
            if (process.env.NODE_ENV === 'development') {
                console.debug('Email service: Verification message resent')
            }
        } else {
            setVerificationError(emailResult.error || 'Failed to resend verification email. Please try again.')
        }

        setIsResending(false)
    }

    const setupDemoUser = (demoUser) => {
        // Create a demo user with verified status - only store safe data
        const demoUserData = {
            email: demoUser.email,
            userName: demoUser.name,
            gender: demoUser.gender,
            userId: 'demo-' + Math.random().toString(36).substr(2, 9),
            registeredAt: new Date().toISOString(),
            loginHistory: [new Date().toISOString()],
            isVerified: true,  // Demo users are pre-verified
            isDemo: true  // Mark as demo user
            // NOTE: verificationCode intentionally excluded
        }

        // Check if demo user already exists
        const existingDemoUser = registeredUsers.find(u => u.email === demoUser.email)
        let usersToSave = registeredUsers

        if (!existingDemoUser) {
            usersToSave = [...registeredUsers, demoUserData]
            setRegisteredUsers(usersToSave)
            secureStorage.setRegisteredUsers(usersToSave)
        } else {
            demoUserData.userId = existingDemoUser.userId
            demoUserData.loginHistory = [...(existingDemoUser.loginHistory || []), new Date().toISOString()]
            usersToSave = registeredUsers.map(u => u.email === demoUser.email ? demoUserData : u)
            setRegisteredUsers(usersToSave)
            secureStorage.setRegisteredUsers(usersToSave)
        }

        // Save demo user session
        secureStorage.setUserInfo(demoUserData)

        // Close demo guide and login
        setShowDemoGuide(false)
        onLoginSuccess(demoUserData)
    }

    return (
        <>
            {showDemoGuide ? (
                <DemoGuide
                    onSelectDemo={(demoUserData) => {
                        onLoginSuccess(demoUserData)
                    }}
                    onBack={() => setShowDemoGuide(false)}
                />
            ) : (
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
                                    setSignInPassword('')
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
                                    setRegisterData({ email: '', userName: '', gender: 'other', password: '', confirmPassword: '' })
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
                                                {nameValidation.isValid === true && <span className="validation-icon valid">✓</span>}
                                                {nameValidation.isValid === false && <span className="validation-icon invalid">✗</span>}
                                            </label>
                                            <input
                                                id="registerName"
                                                type="text"
                                                placeholder="Enter your name"
                                                value={registerData.userName}
                                                onChange={(e) => handleNameChange(e.target.value)}
                                                disabled={isLoading}
                                                className={`form-input ${nameValidation.isValid === true ? 'input-valid' : ''} ${nameValidation.isValid === false ? 'input-invalid' : ''}`}
                                                aria-label="Your name"
                                                aria-describedby="name-validation"
                                                autoComplete="name"
                                            />
                                            {nameValidation.message && (
                                                <small id="name-validation" className={`validation-message ${nameValidation.isValid ? 'valid' : 'invalid'}`}>
                                                    {nameValidation.message}
                                                </small>
                                            )}
                                        </motion.div>

                                        {/* Email Input */}
                                        <motion.div
                                            className="form-group"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.15, duration: 0.4 }}
                                        >
                                            <label htmlFor="registerEmail">
                                                <span className="label-icon">📧</span>
                                                <span className="label-text">Email Address</span>
                                                {emailValidation.isValid === true && <span className="validation-icon valid">✓</span>}
                                                {emailValidation.isValid === false && <span className="validation-icon invalid">✗</span>}
                                            </label>
                                            <input
                                                id="registerEmail"
                                                type="email"
                                                placeholder="your@email.com"
                                                value={registerData.email}
                                                onChange={(e) => handleEmailChange(e.target.value)}
                                                disabled={isLoading}
                                                className={`form-input ${emailValidation.isValid === true ? 'input-valid' : ''} ${emailValidation.isValid === false ? 'input-invalid' : ''}`}
                                                aria-label="Email address"
                                                aria-describedby="email-validation"
                                                autoComplete="email"
                                            />
                                            {emailValidation.message && (
                                                <small id="email-validation" className={`validation-message ${emailValidation.isValid ? 'valid' : 'invalid'}`}>
                                                    {emailValidation.message}
                                                </small>
                                            )}
                                        </motion.div>

                                        {/* Password Input */}
                                        <motion.div
                                            className="form-group"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2, duration: 0.4 }}
                                        >
                                            <label htmlFor="registerPassword">
                                                <span className="label-icon">🔒</span>
                                                <span className="label-text">Password</span>
                                                {passwordValidation.isValid === true && <span className="validation-icon valid">✓</span>}
                                                {passwordValidation.isValid === false && <span className="validation-icon invalid">✗</span>}
                                            </label>
                                            <div className="password-input-wrapper">
                                                <input
                                                    id="registerPassword"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="At least 8 characters"
                                                    value={registerData.password}
                                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                                    disabled={isLoading}
                                                    className={`form-input password-input ${passwordValidation.isValid === true ? 'input-valid' : ''} ${passwordValidation.isValid === false ? 'input-invalid' : ''}`}
                                                    aria-label="Password"
                                                    aria-describedby="password-validation"
                                                />
                                                <motion.button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    disabled={isLoading}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                                </motion.button>
                                            </div>
                                            {passwordValidation.message && (
                                                <small id="password-validation" className={`validation-message ${passwordValidation.isValid ? 'valid' : 'invalid'}`} style={{ color: passwordValidation.color }}>
                                                    {passwordValidation.message}
                                                </small>
                                            )}
                                        </motion.div>

                                        {/* Confirm Password Input */}
                                        <motion.div
                                            className="form-group"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.25, duration: 0.4 }}
                                        >
                                            <label htmlFor="confirmPassword">
                                                <span className="label-icon">🔐</span>
                                                <span className="label-text">Confirm Password</span>
                                                {confirmPasswordValidation.isValid === true && <span className="validation-icon valid">✓</span>}
                                                {confirmPasswordValidation.isValid === false && <span className="validation-icon invalid">✗</span>}
                                            </label>
                                            <div className="password-input-wrapper">
                                                <input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    placeholder="Re-enter password"
                                                    value={registerData.confirmPassword}
                                                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                                    disabled={isLoading}
                                                    className={`form-input password-input ${confirmPasswordValidation.isValid === true ? 'input-valid' : ''} ${confirmPasswordValidation.isValid === false ? 'input-invalid' : ''}`}
                                                    aria-label="Confirm password"
                                                    aria-describedby="confirm-password-validation"
                                                />
                                                <motion.button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    disabled={isLoading}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                                </motion.button>
                                            </div>
                                            {confirmPasswordValidation.message && (
                                                <small id="confirm-password-validation" className={`validation-message ${confirmPasswordValidation.isValid ? 'valid' : 'invalid'}`}>
                                                    {confirmPasswordValidation.message}
                                                </small>
                                            )}
                                        </motion.div>

                                        {/* Gender Selection */}
                                        <motion.div
                                            className="form-group"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3, duration: 0.4 }}
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
                                            transition={{ delay: 0.35, duration: 0.4 }}
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

                                        {/* OR Try Demo Button */}
                                        <motion.button
                                            className="demo-or-btn"
                                            type="button"
                                            onClick={() => {
                                                setShowDemoGuide(true)
                                                setError('')
                                            }}
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4, duration: 0.4 }}
                                        >
                                            <span className="btn-icon">🎬</span>
                                            <span className="btn-text">OR Try Demo</span>
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

                                        {/* Password Input */}
                                        <motion.div
                                            className="form-group"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2, duration: 0.4 }}
                                        >
                                            <label htmlFor="signinPassword">
                                                <span className="label-icon">🔒</span>
                                                <span className="label-text">Password</span>
                                            </label>
                                            <div className="password-input-wrapper">
                                                <input
                                                    id="signinPassword"
                                                    type={showSignInPassword ? 'text' : 'password'}
                                                    placeholder="Enter your password"
                                                    value={signInPassword}
                                                    onChange={(e) => setSignInPassword(e.target.value)}
                                                    disabled={isLoading}
                                                    className="form-input password-input"
                                                />
                                                <motion.button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                                                    disabled={isLoading}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    {showSignInPassword ? '👁️' : '👁️‍🗨️'}
                                                </motion.button>
                                            </div>
                                        </motion.div>

                                        {/* Info Message */}
                                        <motion.p
                                            className="signin-info"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.4 }}
                                        >
                                            <span className="info-icon">ℹ️</span>
                                            <span className="info-text">Enter your email and password to continue</span>
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
                                            transition={{ delay: 0.4, duration: 0.4 }}
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
                                    className="verification-dialog-overlay"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="verification-title"
                                >
                                    {/* Floating music notes */}
                                    <div className="floating-notes">
                                        <span className="floating-note">🎵</span>
                                        <span className="floating-note">🎶</span>
                                        <span className="floating-note">🎵</span>
                                        <span className="floating-note">🎶</span>
                                        <span className="floating-note">🎵</span>
                                        <span className="floating-note">🎶</span>
                                    </div>

                                    <motion.div
                                        className="verification-dialog"
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Success Animation Overlay */}
                                        <AnimatePresence>
                                            {showSuccessAnimation && (
                                                <motion.div
                                                    className="success-overlay"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        background: 'rgba(76, 175, 80, 0.95)',
                                                        borderRadius: '20px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        zIndex: 10
                                                    }}
                                                >
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: [0, 1.2, 1] }}
                                                        transition={{ duration: 0.5 }}
                                                        style={{ fontSize: '4rem' }}
                                                    >
                                                        ✅
                                                    </motion.div>
                                                    <motion.p
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.3 }}
                                                        style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1rem' }}
                                                    >
                                                        Email Verified!
                                                    </motion.p>
                                                    <motion.p
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.5 }}
                                                        style={{ color: 'rgba(255,255,255,0.9)', marginTop: '0.5rem' }}
                                                    >
                                                        Redirecting...
                                                    </motion.p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="dialog-header">
                                            <span className="dialog-icon">📧</span>
                                            <h3 id="verification-title">Verify Your Email</h3>
                                            <p>Code sent to <strong>{verificationDialogEmail}</strong></p>
                                            <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#b0b0b0' }}>
                                                📨 Check inbox or spam folder
                                            </p>
                                        </div>

                                        <form onSubmit={handleVerifyEmail} style={{ padding: '1rem 1.5rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                            {emailSentSuccess && (
                                                <motion.div
                                                    className="success-message"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    role="alert"
                                                    aria-live="polite"
                                                    style={{
                                                        background: 'rgba(76, 175, 80, 0.2)',
                                                        border: '1px solid #4caf50',
                                                        borderRadius: '6px',
                                                        padding: '0.5rem 0.75rem',
                                                        marginBottom: '0.75rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.4rem',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    <span>✅</span>
                                                    <span style={{ color: '#4caf50' }}>Email sent!</span>
                                                </motion.div>
                                            )}

                                            {verificationError && (
                                                <motion.div
                                                    className="error-message"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    role="alert"
                                                    aria-live="assertive"
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
                                                style={{ width: '100%', marginBottom: '0.5rem' }}
                                            >
                                                <label htmlFor="verificationCode" style={{ marginBottom: '0.4rem' }}>
                                                    <span className="label-icon">🔐</span>
                                                    <span className="label-text" style={{ fontSize: '0.85rem' }}>Verification Code</span>
                                                </label>
                                                <input
                                                    ref={verificationInputRef}
                                                    id="verificationCode"
                                                    type="text"
                                                    placeholder="ABC123"
                                                    value={verificationInputCode}
                                                    onChange={(e) => handleVerificationCodeChange(e.target.value)}
                                                    maxLength="6"
                                                    className="form-input"
                                                    style={{ letterSpacing: '6px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold', padding: '0.8rem 1rem' }}
                                                    aria-label="Verification code"
                                                    autoComplete="one-time-code"
                                                    autoFocus
                                                />
                                                <small style={{ color: '#888', marginTop: '0.3rem', display: 'block', textAlign: 'center', fontSize: '0.75rem' }}>
                                                    Auto-submits when complete
                                                </small>
                                            </motion.div>

                                            <motion.button
                                                className="login-btn"
                                                type="submit"
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2, duration: 0.4 }}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                                            >
                                                <span className="btn-icon">✅</span>
                                                <span className="btn-text">Verify</span>
                                            </motion.button>

                                            <motion.button
                                                className="resend-btn"
                                                type="button"
                                                onClick={handleResendCode}
                                                disabled={isResending || resendCooldown > 0}
                                                whileHover={{ scale: resendCooldown > 0 ? 1 : 1.05 }}
                                                whileTap={{ scale: resendCooldown > 0 ? 1 : 0.95 }}
                                                style={{
                                                    marginTop: '0.6rem',
                                                    background: 'transparent',
                                                    border: '1px solid #667eea',
                                                    color: resendCooldown > 0 ? '#888' : '#667eea',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '6px',
                                                    cursor: (isResending || resendCooldown > 0) ? 'not-allowed' : 'pointer',
                                                    opacity: (isResending || resendCooldown > 0) ? 0.6 : 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.4rem',
                                                    minWidth: '140px',
                                                    fontSize: '0.85rem'
                                                }}
                                                aria-disabled={isResending || resendCooldown > 0}
                                            >
                                                {isResending ? (
                                                    <>
                                                        <span className="spinner"></span>
                                                        <span>Sending...</span>
                                                    </>
                                                ) : resendCooldown > 0 ? (
                                                    <>
                                                        <span>⏱️</span>
                                                        <span>Resend in {resendCooldown}s</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>🔄</span>
                                                        <span>Resend Code</span>
                                                    </>
                                                )}
                                            </motion.button>

                                            <motion.button
                                                className="cancel-btn"
                                                type="button"
                                                onClick={() => {
                                                    setShowVerificationDialog(false)
                                                    setVerificationInputCode('')
                                                    setVerificationError('')
                                                    setEmailSentSuccess(false)
                                                    setResendCooldown(0)
                                                }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                style={{ marginTop: '0.6rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
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
            )}
        </>
    )
}

Login.propTypes = {
    onLoginSuccess: PropTypes.func.isRequired
}
