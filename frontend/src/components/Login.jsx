import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import emailjs from '@emailjs/browser'
import DemoGuide from './DemoGuide'
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
    const [showDemoGuide, setShowDemoGuide] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [emailSentSuccess, setEmailSentSuccess] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)
    const [emailValidation, setEmailValidation] = useState({ isValid: null, message: '' })
    const [nameValidation, setNameValidation] = useState({ isValid: null, message: '' })
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)

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

            const verifiedUser = { ...user, isVerified: true }
            const updatedUsers = registeredUsers.map(u =>
                u.email === verificationDialogEmail ? verifiedUser : u
            )
            setRegisteredUsers(updatedUsers)
            localStorage.setItem('musicMoodUsers', JSON.stringify(updatedUsers))
            localStorage.setItem('musicMoodUser', JSON.stringify(verifiedUser))

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
                console.error('Invalid email format:', email)
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

            console.log('📧 Sending verification email')
            console.log('Recipient Email (to_email):', email)
            console.log('User Name:', userName)
            console.log('Verification Code:', verificationCode)
            console.log('Service ID:', SERVICE_ID)
            console.log('Template ID:', TEMPLATE_ID)

            const response = await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                templateParams,
                PUBLIC_KEY
            )

            console.log('✅ Verification email sent successfully!')
            console.log('Response Status:', response.status)
            console.log('Response Text:', response.text)
            return { success: true }

        } catch (error) {
            console.error('❌ Failed to send verification email:', error.message)

            let errorMessage = 'Failed to send verification email. Please try again.'

            // Log specific error codes for debugging
            if (error.status === 400) {
                console.error('Error 400: Invalid request')
                console.error('⚠️ IMPORTANT: Check your EmailJS template uses these EXACT variable names:')
                console.error('   - {{to_email}} for recipient email')
                console.error('   - {{user_name}} for user name')
                console.error('   - {{verification_code}} for verification code')
                errorMessage = 'Email service configuration error. Please contact support.'
            } else if (error.status === 401) {
                console.error('Error 401: Unauthorized - Check public key:', PUBLIC_KEY)
                errorMessage = 'Email service authentication failed. Please contact support.'
            } else if (error.status === 404) {
                console.error('Error 404: Not found - Check Service ID and Template ID')
                errorMessage = 'Email service not found. Please contact support.'
            } else if (error.status === 429) {
                console.error('Error 429: Too many requests')
                errorMessage = 'Too many email requests. Please wait a moment and try again.'
            } else {
                console.error('Error:', error.status, error.text)
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
            // Generate secure verification code
            const verificationCode = generateVerificationCode()

            // Store the email being registered to prevent accidental email changes
            const registrationEmail = registerData.email
            const registrationName = registerData.userName

            // Create user data object
            const userData = {
                email: registrationEmail,
                userName: registrationName,
                gender: registerData.gender,
                userId: Math.random().toString(36).substr(2, 9),
                registeredAt: new Date().toISOString(),
                loginHistory: [new Date().toISOString()],
                isVerified: false,
                verificationCode: verificationCode,
                emailVerified: false  // Track if this specific email was verified
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
            const updatedUsers = [...registeredUsers, userData]
            setRegisteredUsers(updatedUsers)
            localStorage.setItem('musicMoodUsers', JSON.stringify(updatedUsers))

            setIsLoading(false)
            setEmailSentSuccess(true)

            // Show verification dialog with the registered email
            setVerificationDialogEmail(registrationEmail)
            setShowVerificationDialog(true)
            setVerificationInputCode('')
            setVerificationError('')
            setRegisterData({ email: '', userName: '', gender: 'other' })

            // Log registration info
            console.log('User registered with email:', registrationEmail)
            console.log('Verification email sent successfully')
        } catch (err) {
            setIsLoading(false)
            setError('An unexpected error occurred. Please try again.')
            console.error('Registration error:', err)
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

        // Find user by email
        const user = registeredUsers.find(u => u.email === signInEmail)
        if (!user) {
            setError('Email not found. Please register first.')
            return
        }

        setIsLoading(true)

        // Check if user is verified
        if (!user.isVerified) {
            // Generate new verification code and send email
            const newVerificationCode = generateVerificationCode()

            const emailResult = await sendVerificationEmail(
                signInEmail,
                user.userName,
                newVerificationCode
            )

            // Update user with new verification code
            const updatedUser = {
                ...user,
                verificationCode: newVerificationCode
            }
            const updatedUsers = registeredUsers.map(u =>
                u.email === signInEmail ? updatedUser : u
            )
            setRegisteredUsers(updatedUsers)
            localStorage.setItem('musicMoodUsers', JSON.stringify(updatedUsers))

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
            // Update user with new verification code
            const updatedUser = {
                ...user,
                verificationCode: newVerificationCode
            }
            const updatedUsers = registeredUsers.map(u =>
                u.email === verificationDialogEmail ? updatedUser : u
            )
            setRegisteredUsers(updatedUsers)
            localStorage.setItem('musicMoodUsers', JSON.stringify(updatedUsers))

            setEmailSentSuccess(true)
            setVerificationError('')
            setResendCooldown(60) // 60 second cooldown
            console.log('New verification code sent successfully')
        } else {
            setVerificationError(emailResult.error || 'Failed to resend verification email. Please try again.')
        }

        setIsResending(false)
    }

    const setupDemoUser = (demoUser) => {
        // Create a demo user with verified status
        const demoUserData = {
            email: demoUser.email,
            userName: demoUser.name,
            gender: demoUser.gender,
            userId: 'demo-' + Math.random().toString(36).substr(2, 9),
            registeredAt: new Date().toISOString(),
            loginHistory: [new Date().toISOString()],
            isVerified: true,  // Demo users are pre-verified
            verificationCode: 'DEMO123',
            isDemo: true  // Mark as demo user
        }

        // Check if demo user already exists
        const existingDemoUser = registeredUsers.find(u => u.email === demoUser.email)
        let usersToSave = registeredUsers

        if (!existingDemoUser) {
            usersToSave = [...registeredUsers, demoUserData]
            setRegisteredUsers(usersToSave)
            localStorage.setItem('musicMoodUsers', JSON.stringify(usersToSave))
        } else {
            demoUserData.userId = existingDemoUser.userId
            demoUserData.loginHistory = [...(existingDemoUser.loginHistory || []), new Date().toISOString()]
            usersToSave = registeredUsers.map(u => u.email === demoUser.email ? demoUserData : u)
            setRegisteredUsers(usersToSave)
            localStorage.setItem('musicMoodUsers', JSON.stringify(usersToSave))
        }

        // Save demo user session
        localStorage.setItem('musicMoodUser', JSON.stringify(demoUserData))

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
                            <motion.button
                                className={`tab-btn ${showDemoGuide ? 'active' : ''}`}
                                onClick={() => {
                                    setShowDemoGuide(!showDemoGuide)
                                    setError('')
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="tab-emoji">🎬</span>
                                <span className="tab-name">Demo</span>
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
                                            transition={{ delay: 0.2, duration: 0.4 }}
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
