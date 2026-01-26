import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import emailjs from '@emailjs/browser'
import DemoGuide from './DemoGuide'
import { secureStorage } from '../utils/secureStorage'
import { hashPassword, validatePasswordStrength, getPasswordFeedback } from '../utils/passwordUtils'
import { FaEnvelope, FaCheck, FaLock, FaRedo, FaClock, FaExclamationTriangle, FaTimes, FaStar, FaKey, FaMicrophone, FaEye, FaEyeSlash, FaUser, FaMars, FaVenus, FaGenderless, FaMusic, FaFilm, FaInfoCircle, FaVenusMars, FaHeadphones, FaDrum, FaGuitar } from 'react-icons/fa'
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
    const [unverifiedUserChoice, setUnverifiedUserChoice] = useState(null)
    const [unverifiedUserEmail, setUnverifiedUserEmail] = useState('')

    // Forgot Password states
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
    const [forgotPasswordStep, setForgotPasswordStep] = useState(1) // 1: Email, 2: Code & New Password
    const [forgotPasswordCode, setForgotPasswordCode] = useState('')
    const [verificationCodeInput, setVerificationCodeInput] = useState('')
    const [newForgotPassword, setNewForgotPassword] = useState('')
    const [confirmNewForgotPassword, setConfirmNewForgotPassword] = useState('')
    const [forgotPasswordError, setForgotPasswordError] = useState('')
    const [isForgotLoading, setIsForgotLoading] = useState(false)

    const DEMO_USERS = [
        { email: 'demo.music.lover@example.com', name: 'Music Lover', gender: 'male' },
        { email: 'demo.happy.vibes@example.com', name: 'Happy Vibes', gender: 'female' },
        { email: 'demo.chill.mode@example.com', name: 'Chill Mode', gender: 'other' },
        { email: 'demo.rock.fan@example.com', name: 'Rock Fan', gender: 'male' },
        { email: 'demo.jazz.lover@example.com', name: 'Jazz Lover', gender: 'female' },
        { email: 'demo.pop.star@example.com', name: 'Pop Star', gender: 'other' }
    ]

    const verificationInputRef = React.useRef(null)

    useEffect(() => {
        emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'yvSwGRuksv7zAychI') // Public key from env
    }, [])

    useEffect(() => {
        let timer
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown(prev => prev - 1)
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [resendCooldown])

    // Auto-hide "Email Sent" success message after 4 seconds
    useEffect(() => {
        if (emailSentSuccess) {
            const timer = setTimeout(() => {
                setEmailSentSuccess(false)
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [emailSentSuccess])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && showVerificationDialog) {
                e.preventDefault()
                e.stopPropagation()
            }
        }

        if (showVerificationDialog) {
            document.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [showVerificationDialog])

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const saved = await secureStorage.getRegisteredUsers()
                if (saved && Array.isArray(saved)) {
                    setRegisteredUsers(saved)
                }
            } catch (err) {
                // Silent fail - don't expose errors
                setRegisteredUsers([])
            }
        }
        loadUsers()
    }, [])

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

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

        if (registerData.confirmPassword) {
            validateConfirmPassword(registerData.confirmPassword, password)
        }
    }

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

    const handleVerificationCodeChange = (value) => {
        const code = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
        setVerificationInputCode(code)


        if (code.length === 6) {
            setTimeout(() => {
                const user = registeredUsers.find(u => u.email === verificationDialogEmail)
                if (user && code === user.verificationCode) {
                    handleAutoVerify(code)
                }
            }, 300)
        }
    }

    const handleAutoVerify = async (code) => {
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
                isDemo: user.isDemo || false,
                passwordHash: user.passwordHash
            }

            const updatedUsers = registeredUsers.map(u =>
                u.email === verificationDialogEmail ? verifiedUser : u
            )
            setRegisteredUsers(updatedUsers)

            await secureStorage.setRegisteredUsers(updatedUsers)
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
        return Math.random().toString(36).substr(2, 6).toUpperCase()
    }

    // Handle user choice for unverified email
    const handleUnverifiedUserChoice = async (choice) => {
        if (choice === 'verify') {
            // User wants to enter verification code
            const unverifiedUser = registeredUsers.find(u => u.email === unverifiedUserEmail)
            if (unverifiedUser) {
                setVerificationDialogEmail(unverifiedUserEmail)
                setShowVerificationDialog(true)
                setUnverifiedUserChoice(null)
                setUnverifiedUserEmail('')
                setError('')
            }
        } else if (choice === 'registerAgain') {
            // User wants to register again - remove unverified user
            const updatedUsers = registeredUsers.filter(u => u.email !== unverifiedUserEmail)
            setRegisteredUsers(updatedUsers)
            try {
                await secureStorage.setRegisteredUsers(updatedUsers)
            } catch (e) {
                if (process.env.NODE_ENV === 'development') console.debug('Failed to remove unverified user', e)
            }
            setUnverifiedUserChoice(null)
            setUnverifiedUserEmail('')
            setError('You can now register again with this email.')
            // Clear form to let user register fresh
            setRegisterData({ email: '', userName: '', gender: 'other', password: '', confirmPassword: '' })
        }
    }

    // Custom blocking choice dialog (returns true for Keep Existing, false for Use New Details)
    const showConflictChoiceDialog = () => {
        return new Promise((resolve) => {
            try {
                if (typeof document === 'undefined') return resolve(false)

                const container = document.createElement('div')
                container.style.position = 'fixed'
                container.style.inset = '0'
                container.style.display = 'flex'
                container.style.alignItems = 'center'
                container.style.justifyContent = 'center'
                container.style.background = 'rgba(0,0,0,0.45)'
                container.style.zIndex = '99999'

                const box = document.createElement('div')
                box.style.background = 'linear-gradient(135deg,#ffffff,#f3f3ff)'
                box.style.padding = '20px'
                box.style.borderRadius = '12px'
                box.style.maxWidth = '420px'
                box.style.width = '90%'
                box.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)'
                box.style.textAlign = 'center'

                const msg = document.createElement('p')
                msg.textContent = 'This email is already registered. Choose which information to keep:'
                msg.style.marginBottom = '18px'
                msg.style.color = '#111'
                msg.style.fontWeight = '600'

                const btnRow = document.createElement('div')
                btnRow.style.display = 'flex'
                btnRow.style.gap = '12px'
                btnRow.style.justifyContent = 'center'

                const keepBtn = document.createElement('button')
                keepBtn.textContent = 'Keep Existing'
                keepBtn.style.padding = '10px 14px'
                keepBtn.style.borderRadius = '8px'
                keepBtn.style.border = 'none'
                keepBtn.style.cursor = 'pointer'
                keepBtn.style.background = '#28a745'
                keepBtn.style.color = '#fff'

                const useNewBtn = document.createElement('button')
                useNewBtn.textContent = 'Use the new Details'
                useNewBtn.style.padding = '10px 14px'
                useNewBtn.style.borderRadius = '8px'
                useNewBtn.style.border = '1px solid rgba(0,0,0,0.08)'
                useNewBtn.style.cursor = 'pointer'
                useNewBtn.style.background = '#ffffff'
                useNewBtn.style.color = '#111'

                btnRow.appendChild(keepBtn)
                btnRow.appendChild(useNewBtn)
                box.appendChild(msg)
                box.appendChild(btnRow)
                container.appendChild(box)
                document.body.appendChild(container)

                const cleanup = () => {
                    try { document.body.removeChild(container) } catch (e) { }
                    window.removeEventListener('keydown', onKey)
                }

                const onKey = (ev) => {
                    if (ev.key === 'Escape') {
                        cleanup()
                        resolve(false)
                    }
                }

                keepBtn.addEventListener('click', () => {
                    cleanup()
                    resolve(true)
                })

                useNewBtn.addEventListener('click', () => {
                    cleanup()
                    resolve(false)
                })

                window.addEventListener('keydown', onKey)
            } catch (err) {
                resolve(false)
            }
        })
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

        // Normalize email for reliable comparisons
        const normalizedEmail = (registerData.email || '').trim().toLowerCase()

        // Check if email already registered (normalize stored emails too)
        const existing = registeredUsers.find(u => ((u.email || '').trim().toLowerCase()) === normalizedEmail)
        if (existing) {
            // If email exists but not verified, ask user what they want to do
            if (!existing.isVerified) {
                setUnverifiedUserEmail(normalizedEmail)
                setUnverifiedUserChoice('pending')
                setError('Email already registered but not verified. You can enter your verification code or register again.')
                return
            }

            // If email is verified, tell user to sign in instead
            console.debug('[Login] email already registered for verified user:', registerData.email)
            setError('This email is already registered. Please sign in with your credentials or use a different email to register.')
            return
        }

        setIsLoading(true)

        try {
            // Store the email being registered to prevent accidental email changes
            const registrationEmail = normalizedEmail || registerData.email
            const registrationName = registerData.userName

            // Hash password securely
            const hashedPassword = await hashPassword(registerData.password)
            if (process.env.NODE_ENV === 'development') console.debug('[Login] register hashedPassword for', registrationEmail, hashedPassword)

            // Generate secure verification code (stored in memory only, never in localStorage)
            const verificationCode = generateVerificationCode()

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
            await secureStorage.setRegisteredUsers(updatedUsers)

            setIsLoading(false)
            setVerificationDialogEmail(registrationEmail)
            setShowVerificationDialog(true)
            setEmailSentSuccess(true) // Set after showing dialog to ensure visibility
            setVerificationInputCode('')
            setVerificationError('')
            setRegisterData({ email: '', userName: '', gender: 'other', password: '', confirmPassword: '' })

            // Do NOT log user registration details or verification codes
            if (process.env.NODE_ENV === 'development') {
                console.debug('Registration: Verification email sent')
            }
        } catch (err) {
            setIsLoading(false)
            // Surface more helpful message in development for debugging
            if (process.env.NODE_ENV === 'development') {
                console.debug('Registration error occurred:', err)
                setError(`Registration failed: ${err?.message || 'Unknown error'}`)
            } else {
                setError('An unexpected error occurred. Please try again.')
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
            if (process.env.NODE_ENV === 'development') console.debug('[Login] sign-in compare for', signInEmail, { hashedInputPassword, stored: user.passwordHash })

            if (hashedInputPassword !== user.passwordHash) {
                setIsLoading(false)
                setError('Invalid password. Please try again.')
                return
            }

            // Password is correct. Check if user is verified
            if (!user.isVerified) {
                // Generate new verification code and show verification dialog
                const newVerificationCode = generateVerificationCode()

                // Send verification email
                const emailResult = await sendVerificationEmail(signInEmail, user.userName, newVerificationCode)

                if (emailResult.success) {
                    // Update user with new verification code (in-memory only)
                    const updatedUser = { ...user, verificationCode: newVerificationCode }
                    const updatedUsers = registeredUsers.map(u => u.email === signInEmail ? updatedUser : u)
                    setRegisteredUsers(updatedUsers)
                    // Persist safe user info
                    try {
                        await secureStorage.setRegisteredUsers(updatedUsers)
                    } catch (e) {
                        if (process.env.NODE_ENV === 'development') console.debug('Failed storing users after sending verification', e)
                    }

                    setIsLoading(false)
                    setEmailSentSuccess(true)
                    setVerificationDialogEmail(signInEmail)
                    setShowVerificationDialog(true)
                    setVerificationInputCode('')
                    setVerificationError('')
                    return // Do not proceed to login
                } else {
                    setIsLoading(false)
                    setError('Failed to send verification email. Please try again.')
                    return
                }
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
                loginHistory: [...(user.loginHistory || []), new Date().toISOString()],
                passwordHash: user.passwordHash
            }

            // Update in registered users list
            const updatedUsers = registeredUsers.map(u =>
                u.email === signInEmail ? updatedUser : u
            )
            setRegisteredUsers(updatedUsers)
            // Use secure storage instead of localStorage
            try {
                await secureStorage.setRegisteredUsers(updatedUsers)
            } catch (storageError) {
                console.error('Login: Failed to save registered users:', storageError)
            }
            secureStorage.setUserInfo(updatedUser)

            setIsLoading(false)
            console.log('Login: Calling onLoginSuccess with:', updatedUser)
            onLoginSuccess(updatedUser)
        } catch (err) {
            setIsLoading(false)
            setError('An error occurred during sign-in. Please try again.')
            if (process.env.NODE_ENV === 'development') {
                console.debug('Sign-in error occurred')
            }
        }
    }

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault()
        setForgotPasswordError('')

        if (!forgotPasswordEmail.trim()) {
            setForgotPasswordError('Please enter your email address')
            return
        }

        if (!validateEmail(forgotPasswordEmail)) {
            setForgotPasswordError('Please enter a valid email address')
            return
        }

        const user = registeredUsers.find(u => u.email === forgotPasswordEmail)
        if (!user) {
            setForgotPasswordError('No account found with this email. Please check the email or register.')
            return
        }

        setIsForgotLoading(true)
        const code = generateVerificationCode()
        setForgotPasswordCode(code)

        try {
            const result = await sendVerificationEmail(forgotPasswordEmail, user.userName, code)

            if (result.success) {
                setForgotPasswordStep(2)
            } else {
                setForgotPasswordError(result.error || 'Failed to send reset code. Please try again.')
            }
        } catch (err) {
            setForgotPasswordError('An expected error occurred. Please try again.')
        } finally {
            setIsForgotLoading(false)
        }
    }

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault()
        setForgotPasswordError('')

        if (verificationCodeInput.toUpperCase() !== forgotPasswordCode.toUpperCase()) {
            setForgotPasswordError('Invalid verification code. Please check your email.')
            return
        }

        if (newForgotPassword.length < 8) {
            setForgotPasswordError('Password must be at least 8 characters long.')
            return
        }

        if (newForgotPassword !== confirmNewForgotPassword) {
            setForgotPasswordError('Passwords do not match.')
            return
        }

        setIsForgotLoading(true)
        try {
            const newHash = await hashPassword(newForgotPassword)
            const updatedUsers = registeredUsers.map(u =>
                u.email === forgotPasswordEmail ? { ...u, passwordHash: newHash, isVerified: true } : u
            )

            setRegisteredUsers(updatedUsers)
            await secureStorage.setRegisteredUsers(updatedUsers)

            // Success!
            setShowForgotPassword(false)
            setForgotPasswordStep(1)
            setForgotPasswordEmail('')
            setVerificationCodeInput('')
            setNewForgotPassword('')
            setConfirmNewForgotPassword('')
            setEmailSentSuccess(true)
            setError('Password updated successfully! You can now sign in with your new password.')
        } catch (err) {
            setForgotPasswordError('Failed to update password. Please try again.')
        } finally {
            setIsForgotLoading(false)
        }
    }

    const handleCloseVerificationDialog = () => {
        // Remove unverified user when closing verification dialog
        const updatedUsers = registeredUsers.filter(u => u.email !== verificationDialogEmail)
        setRegisteredUsers(updatedUsers)
        try {
            secureStorage.setRegisteredUsers(updatedUsers)
        } catch (e) {
            if (process.env.NODE_ENV === 'development') console.debug('Failed to remove unverified user', e)
        }

        // Clear verification dialog states
        setShowVerificationDialog(false)
        setVerificationDialogEmail('')
        setVerificationInputCode('')
        setVerificationError('')
        setEmailSentSuccess(false)
        setShowSuccessAnimation(false)
        setError('Registration cancelled. Please register again to continue.')
    }

    const handleVerifyEmail = async (e) => {
        e.preventDefault()
        setVerificationError('')

        if (!verificationInputCode.trim()) {
            setVerificationError('Please enter the verification code')
            return
        }

        // Find the user by email
        const user = registeredUsers.find(u => u.email === verificationDialogEmail)
        if (!user) {
            setVerificationError('User not found. Please register again.')
            handleCloseVerificationDialog()
            return
        }

        // Check if verification code matches
        if (verificationInputCode.toUpperCase() === user.verificationCode) {
            // Show success animation first
            setShowSuccessAnimation(true)

            // Mark user as verified - only store safe data
            const verifiedUser = {
                email: user.email,
                userName: user.userName,
                gender: user.gender,
                userId: user.userId,
                registeredAt: user.registeredAt,
                isVerified: true,
                isDemo: user.isDemo || false,
                passwordHash: user.passwordHash // Keep the password hash
            }

            // Update in registered users list
            const updatedUsers = registeredUsers.map(u =>
                u.email === verificationDialogEmail ? verifiedUser : u
            )
            setRegisteredUsers(updatedUsers)
            // Use secure storage instead of localStorage
            await secureStorage.setRegisteredUsers(updatedUsers)
            secureStorage.setUserInfo(verifiedUser)

            // Wait for success animation, then close modal and login
            setTimeout(() => {
                setShowVerificationDialog(false)
                setVerificationInputCode('')
                setEmailSentSuccess(false)
                setShowSuccessAnimation(false)
                onLoginSuccess(verifiedUser)
            }, 1500)
        } else {
            setVerificationError('Invalid verification code. Please check your email and try again. OR, Register again to receive a new code.')
        }
    }

    // Prevent users from skipping verification - remove unverified user when dialog is closed
    const handleBackFromVerification = () => {
        handleCloseVerificationDialog()
    }

    const handleResendCode = async () => {
        if (resendCooldown > 0) return

        setIsResending(true)
        setVerificationError('')
        setEmailSentSuccess(false) // Clear previous success state immediately

        // Find the user by email
        const user = registeredUsers.find(u => u.email === verificationDialogEmail)
        if (!user) {
            setVerificationError('User not found. Please register again.')
            handleCloseVerificationDialog()
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
            await secureStorage.setRegisteredUsers(updatedUsers)

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

    const setupDemoUser = async (demoUser) => {
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
            await secureStorage.setRegisteredUsers(usersToSave)
        } else {
            demoUserData.userId = existingDemoUser.userId
            demoUserData.loginHistory = [...(existingDemoUser.loginHistory || []), new Date().toISOString()]
            usersToSave = registeredUsers.map(u => u.email === demoUser.email ? demoUserData : u)
            setRegisteredUsers(usersToSave)
            await secureStorage.setRegisteredUsers(usersToSave)
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
                        <div className="musical-note note-1"><FaMusic /></div>
                        <div className="musical-note note-2"><FaHeadphones /></div>
                        <div className="musical-note note-3"><FaMicrophone /></div>
                        <div className="musical-note note-4"><FaMusic /></div>
                        <div className="musical-note note-5"><FaDrum /></div>
                        <div className="musical-note note-6"><FaGuitar /></div>
                    </div>

                    <motion.div
                        className="login-card"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        style={{ display: showConflictDialog || showVerificationDialog ? 'none' : 'block' }}
                    >
                        {/* Animated Header */}
                        <motion.div
                            className="login-header"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <div className="header-icon"><FaMusic style={{ color: '#00c8ff' }} /></div>
                            <h1 style={{ background: 'linear-gradient(to right, #00c8ff, #fff700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold', fontSize: '1.8rem' }}>Music Mood Matcher</h1>
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
                                    // Reset validation states
                                    setEmailValidation({ isValid: null, message: '' })
                                    setNameValidation({ isValid: null, message: '' })
                                    setPasswordValidation({ isValid: null, message: '', color: '' })
                                    setConfirmPasswordValidation({ isValid: null, message: '' })
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaStar className="tab-emoji" style={{ color: '#FFD700', fontSize: '1.2rem' }} />
                                <span className="tab-name">Register</span>
                            </motion.button>
                            <motion.button
                                className={`tab-btn ${isSignIn ? 'active' : ''}`}
                                onClick={() => {
                                    setIsSignIn(true)
                                    setError('')
                                    setRegisterData({ email: '', userName: '', gender: 'other', password: '', confirmPassword: '' })
                                    // Reset validation states
                                    setEmailValidation({ isValid: null, message: '' })
                                    setNameValidation({ isValid: null, message: '' })
                                    setPasswordValidation({ isValid: null, message: '', color: '' })
                                    setConfirmPasswordValidation({ isValid: null, message: '' })
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaKey className="tab-emoji" style={{ color: '#00d9ff', fontSize: '1.2rem' }} />
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
                                                <span className="error-icon"><FaExclamationTriangle style={{ color: '#ff6b6b' }} /></span>
                                                <span className="error-text">{error}</span>
                                            </motion.div>
                                        )}

                                        {/* Unverified User Choice Buttons */}
                                        {unverifiedUserChoice === 'pending' && (
                                            <motion.div
                                                className="unverified-choice-buttons"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{
                                                    display: 'flex',
                                                    gap: '10px',
                                                    marginTop: '12px',
                                                    flexWrap: 'wrap',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <motion.button
                                                    type="button"
                                                    onClick={() => handleUnverifiedUserChoice('verify')}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{
                                                        padding: '10px 16px',
                                                        background: 'linear-gradient(135deg, #4caf50, #45a049)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                        fontWeight: '600',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    <FaCheck style={{ marginRight: '6px' }} />
                                                    Enter Code
                                                </motion.button>
                                                <motion.button
                                                    type="button"
                                                    onClick={() => handleUnverifiedUserChoice('registerAgain')}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{
                                                        padding: '10px 16px',
                                                        background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                        fontWeight: '600',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    <FaTimes style={{ marginRight: '6px' }} />
                                                    Register Again
                                                </motion.button>
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
                                                <FaMicrophone className="label-icon" style={{ color: '#ff6b6b' }} />
                                                <span className="label-text"> Your Name</span>
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
                                                <span className="label-icon"><FaEnvelope className="label-icon" style={{ color: '#00ffa6' }} /></span>
                                                <span className="label-text"> Email Address</span>
                                                {emailValidation.isValid === true && <span className="validation-icon valid"><FaCheck /></span>}
                                                {emailValidation.isValid === false && <span className="validation-icon invalid"><FaTimes /></span>}
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
                                                <FaLock className="label-icon" style={{ color: '#db9937' }} />
                                                <span className="label-text"> Password</span>
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
                                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
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
                                                <span className="label-icon"><FaLock className="label-icon" style={{ color: '#ff9900' }} /></span>
                                                <span className="label-text"> Confirm Password</span>
                                                {confirmPasswordValidation.isValid === true && <span className="validation-icon valid"><FaCheck /></span>}
                                                {confirmPasswordValidation.isValid === false && <span className="validation-icon invalid"><FaTimes /></span>}
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
                                                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
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
                                                <FaVenusMars className="label-icon" style={{ color: '#00c8ff' }} />
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
                                                        <FaMars style={{ color: '#1e88e5', fontSize: '1.5rem' }} />
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
                                                        <FaVenus style={{ color: '#e91e63', fontSize: '1.5rem' }} />
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
                                                        <FaGenderless style={{ color: '#000000', fontSize: '1.5rem' }} />
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
                                                    <FaMusic className="btn-icon" style={{ marginRight: '0.5rem' }} />
                                                    <span className="btn-text">Start Your Journey</span>
                                                    <FaMusic className="btn-icon" style={{ marginLeft: '0.5rem' }} />
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
                                            <FaFilm className="btn-icon" style={{ marginRight: '0.5rem' }} />
                                            <span className="btn-text">OR Try Demo </span>
                                            <FaFilm className="btn-icon" style={{ marginLeft: '0.5rem' }} />
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
                                                <span className="error-icon"><FaExclamationTriangle style={{ color: '#ff6b6b' }} /></span>
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
                                                <span className="label-icon"><FaEnvelope className="label-icon" style={{ color: '#00ffa6' }} /></span>
                                                <span className="label-text"> Email Address</span>
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
                                                <FaLock className="label-icon" style={{ color: '#ff9800' }} />
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
                                                    {showSignInPassword ? <FaEye /> : <FaEyeSlash />}
                                                </motion.button>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                                                <button
                                                    type="button"
                                                    className="forgot-password-link"
                                                    onClick={() => {
                                                        setShowForgotPassword(true)
                                                        setForgotPasswordEmail(signInEmail)
                                                        setForgotPasswordStep(1)
                                                        setForgotPasswordError('')
                                                    }}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#2196F3',
                                                        cursor: 'pointer',
                                                        fontSize: '0.85rem',
                                                        padding: 0,
                                                        textDecoration: 'none',
                                                        borderRadius: '12px',
                                                        outline: 'none'
                                                    }}
                                                >
                                                    Forgot Password?
                                                </button>
                                            </div>
                                        </motion.div>

                                        {/* Info Message */}
                                        <motion.p
                                            className="signin-info"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.4 }}
                                            style={{ marginTop: '1rem' }}
                                        >
                                            <FaInfoCircle className="info-icon" style={{ color: '#2196F3', marginRight: '0.5rem' }} />
                                            <span className="info-text">Enter your email and password to continue</span>
                                            <FaInfoCircle className="info-icon" style={{ color: '#2196F3', marginLeft: '0.5rem' }} />
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
                                                    <FaKey className="btn-icon" style={{ marginRight: '0.5rem' }} />
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
                                            <span className="dialog-icon"><FaExclamationTriangle style={{ color: '#ff9800', fontSize: '2rem' }} /></span>
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
                                                    <span className="btn-icon"><FaCheck /></span>
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
                                                        // Update user with new details including new password
                                                        (async () => {
                                                            const hashedPassword = await hashPassword(registerData.password)
                                                            const updatedUser = {
                                                                ...existingUser,
                                                                userName: registerData.userName,
                                                                gender: registerData.gender,
                                                                passwordHash: hashedPassword
                                                            }
                                                            const updatedUsers = registeredUsers.map(u =>
                                                                u.email === registerData.email ? updatedUser : u
                                                            )
                                                            setRegisteredUsers(updatedUsers)
                                                            await secureStorage.setRegisteredUsers(updatedUsers)
                                                            secureStorage.setUserInfo(updatedUser)
                                                            setShowConflictDialog(false)
                                                            onLoginSuccess(updatedUser, { openProfile: true })
                                                        })()
                                                    }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <span className="btn-icon"><FaRedo /></span>
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
                                            <span className="btn-icon"><FaTimes style={{ color: '#ff6b6b' }} /></span>
                                            <span className="btn-text">Cancel</span>
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                </div>
            )}

            {/* Verification Dialog - Positioned at Root Level to ensure visibility */}
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
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="floating-notes">
                            <span className="floating-note"><FaMusic /></span>
                            <span className="floating-note"><FaHeadphones /></span>
                            <span className="floating-note"><FaMicrophone /></span>
                            <span className="floating-note"><FaMusic /></span>
                            <span className="floating-note"><FaDrum /></span>
                            <span className="floating-note"><FaGuitar /></span>
                        </div>

                        <motion.div
                            className="verification-dialog"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                        >
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
                                            <FaCheck />
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
                                <span className="dialog-icon"><FaEnvelope style={{ color: '#00ffee', fontSize: '2.5rem' }} /></span>
                                <h3 id="verification-title" style={{ fontSize: '1.45rem', marginTop: '0.6rem', background: 'linear-gradient(to right, #fff700, #00c8ff, #fff700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>Email Verification Required</h3>
                                <p style={{ marginTop: '0.8rem', marginBottom: '0.8rem', fontSize: '1.05rem', fontWeight: '600', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <FaEnvelope style={{ color: '#00c8ff', fontSize: '1rem' }} />
                                    <span style={{ color: '#ffffff' }}>Code sent to : </span>
                                    <span style={{ background: 'linear-gradient(to right, #fff700, #00c8ff, #fff700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>{verificationDialogEmail}</span>
                                    <FaEnvelope style={{ color: '#00c8ff', fontSize: '1rem' }} />
                                </p>
                                <div style={{ borderTop: '1px solid rgba(0, 200, 255, 0.2)', paddingTop: '0.8rem', marginTop: '0.5rem' }}>
                                    <p style={{ fontSize: '0.92rem', marginBottom: '0.6rem', background: 'linear-gradient(to right, #fff700, #00c8ff, #fff700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '700', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <FaEnvelope style={{ color: '#00c8ff', fontSize: '1rem' }} />
                                        <span>Check inbox or spam folder • Verification required to continue</span>
                                        <FaEnvelope style={{ color: '#00c8ff', fontSize: '1rem' }} />
                                    </p>
                                    <p style={{ fontSize: '0.85rem', marginTop: '0.6rem', background: 'linear-gradient(to right, #fff700, #00c8ff, #fff700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '600', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <FaExclamationTriangle style={{ color: '#fff700' }} />
                                        You must verify your email to complete registration
                                        <FaExclamationTriangle style={{ color: '#fff700' }} />
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleVerifyEmail} style={{ padding: '0.6rem 1.5rem 1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                {emailSentSuccess && (
                                    <motion.div
                                        className="success-message"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        role="alert"
                                        aria-live="polite"
                                        style={{
                                            background: 'rgba(58, 155, 61, 0.2)',
                                            border: '1px solid #4caf50',
                                            borderRadius: '6px',
                                            padding: '0.5rem 1rem',
                                            marginBottom: '0.6rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <FaCheck style={{ color: '#00c8ff', fontSize: '1.1rem' }} />
                                        <span style={{ background: 'linear-gradient(to right, #fff700, #00c8ff, #fff700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>Email sent</span>
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
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}
                                    >
                                        <FaExclamationTriangle style={{ color: '#fff700' }} />
                                        <span style={{ background: 'linear-gradient(to right, #fff700, #00c8ff, #fff700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>{verificationError}</span>
                                        <FaExclamationTriangle style={{ color: '#fff700' }} />
                                    </motion.div>
                                )}

                                <motion.div
                                    className="form-group"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1, duration: 0.4 }}
                                    style={{ width: '100%', marginBottom: '1rem', marginTop: '0.6rem' }}
                                >
                                    <label htmlFor="verificationCode" style={{ marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>
                                        <span className="label-icon" style={{ color: '#00c8ff', fontSize: '1rem' }}><FaLock /></span>
                                        <span className="label-text" style={{ background: 'linear-gradient(to right, #fff700, #00c8ff, #fff700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>Verification Code</span>
                                        <span className="label-icon" style={{ color: '#00c8ff', fontSize: '1rem' }}><FaLock /></span>
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
                                        style={{ letterSpacing: '6px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', padding: '0.6rem 1rem', color: '#00c8ff', width: '200px', margin: '0 auto', display: 'block' }}
                                        aria-label="Verification code"
                                        autoComplete="one-time-code"
                                        autoFocus
                                    />
                                    <small style={{ marginTop: '0.4rem', display: 'block', textAlign: 'center', fontSize: '0.85rem', fontWeight: '600' }}>
                                        <FaInfoCircle style={{ marginRight: '0.4rem', color: '#00c8ff', fontSize: '0.9rem' }} />
                                        <span style={{ background: 'linear-gradient(to right, #fff700, #00c8ff, #fff700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Auto-submits when complete</span>
                                    </small>
                                </motion.div>

                                <motion.button
                                    className="login-btn"
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem 2.5rem', fontSize: '1.1rem', fontWeight: '700', marginTop: '0.5rem', width: '100%' }}
                                >
                                    <span className="btn-icon"><FaCheck style={{ color: '#000000', fontSize: '1.2rem' }} /></span>
                                    <span className="btn-text" style={{ color: '#000000' }}>Verify</span>
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
                                        border: '1.5px solid rgba(0, 200, 255, 0.5)',
                                        color: resendCooldown > 0 ? '#666' : '#00c8ff',
                                        padding: '0.7rem 1.5rem',
                                        borderRadius: '10px',
                                        cursor: (isResending || resendCooldown > 0) ? 'not-allowed' : 'pointer',
                                        opacity: (isResending || resendCooldown > 0) ? 0.5 : 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        width: '100%',
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease'
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
                                            <span><FaClock style={{ color: '#fff700', fontSize: '1rem' }} /></span>
                                            <span>Resend in {resendCooldown}s</span>
                                        </>
                                    ) : (
                                        <>
                                            <span><FaRedo style={{ color: '#00c8ff', fontSize: '1rem' }} /></span>
                                            <span style={{ background: 'linear-gradient(to right, #fff700, #00c8ff, #fff700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>Resend Code</span>
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Forgot Password Dialog */}
            <AnimatePresence>
                {showForgotPassword && (
                    <motion.div
                        className="verification-dialog-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ zIndex: 1000 }}
                    >
                        <div className="floating-notes">
                            <span className="floating-note"><FaMusic /></span>
                            <span className="floating-note"><FaHeadphones /></span>
                            <span className="floating-note"><FaMicrophone /></span>
                            <span className="floating-note"><FaDrum /></span>
                            <span className="floating-note"><FaGuitar /></span>
                            <span className="floating-note"><FaMusic /></span>
                        </div>

                        <motion.div
                            className="verification-dialog"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                width: '92%',
                                maxWidth: '420px',
                                padding: 'min(2.5rem, 8vw)',
                                position: 'relative',
                                background: 'rgba(5, 5, 10, 0.95)',
                                backdropFilter: 'blur(30px)',
                                border: '1px solid rgba(0, 200, 255, 0.4)',
                                borderRadius: '24px',
                                boxShadow: '0 0 30px rgba(0, 200, 255, 0.2), 0 20px 50px rgba(0,0,0,0.9)'
                            }}
                        >
                            <motion.button
                                type="button"
                                className="close-dialog"
                                onClick={() => setShowForgotPassword(false)}
                                whileHover={{ scale: 1.1, rotate: 90, color: '#ff4b4b' }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'none',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.5)',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                <FaTimes />
                            </motion.button>

                            <div className="dialog-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 12 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1rem'
                                    }}
                                >
                                    <FaLock style={{ color: '#ff9800', fontSize: '2.5rem' }} />
                                </motion.div>
                                <h3 style={{
                                    color: 'white',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    margin: 0,
                                    background: 'linear-gradient(to right, #ff9800, #ffc107)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>Reset Password</h3>
                                <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                                    {forgotPasswordStep === 1
                                        ? "Enter your email to receive a verification code."
                                        : "Enter the 6-digit code and your new password."}
                                </p>
                            </div>

                            {forgotPasswordError && (
                                <motion.div
                                    className="error-message"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        marginTop: '1rem',
                                        marginBottom: '1rem',
                                        background: 'rgba(255, 107, 107, 0.1)',
                                        border: 'none',
                                        borderRadius: '10px',
                                        padding: '0.8rem',
                                        color: '#ff6b6b',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <FaExclamationTriangle /> {forgotPasswordError}
                                </motion.div>
                            )}

                            {forgotPasswordStep === 1 ? (
                                <form onSubmit={handleForgotPasswordSubmit} style={{ width: '100%' }}>
                                    <div className="form-group">
                                        <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                                        <div className="password-input-wrapper">
                                            <input
                                                type="email"
                                                placeholder="your@email.com"
                                                value={forgotPasswordEmail}
                                                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                                className="form-input"
                                                style={{
                                                    width: '100%',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: 'none',
                                                    borderBottom: '2px solid rgba(0, 200, 255, 0.7)',
                                                    borderRadius: '12px'
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <motion.button
                                        className="login-btn"
                                        type="submit"
                                        disabled={isForgotLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem', color: '#000000', fontWeight: 'bold' }}
                                    >
                                        {isForgotLoading ? <span className="spinner"></span> : "Send Reset Code"}
                                    </motion.button>
                                </form>
                            ) : (
                                <form onSubmit={handleResetPasswordSubmit} style={{ width: '100%' }}>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Verification Code</label>
                                        <input
                                            type="text"
                                            placeholder="Enter 6-digit code"
                                            value={verificationCodeInput}
                                            onChange={(e) => setVerificationCodeInput(e.target.value)}
                                            className="form-input"
                                            style={{
                                                width: '100%',
                                                textAlign: 'center',
                                                letterSpacing: '4px',
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: 'none',
                                                borderBottom: '2px solid rgba(0, 200, 255, 0.7)',
                                                borderRadius: '12px'
                                            }}
                                            required
                                            maxLength={6}
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                                        <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>New Password</label>
                                        <input
                                            type="password"
                                            placeholder="At least 8 characters"
                                            value={newForgotPassword}
                                            onChange={(e) => setNewForgotPassword(e.target.value)}
                                            className="form-input"
                                            style={{
                                                width: '100%',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: 'none',
                                                borderBottom: '2px solid rgba(0, 200, 255, 0.7)',
                                                borderRadius: '12px'
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>Confirm New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Repeat new password"
                                            value={confirmNewForgotPassword}
                                            onChange={(e) => setConfirmNewForgotPassword(e.target.value)}
                                            className="form-input"
                                            style={{
                                                width: '100%',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: 'none',
                                                borderBottom: '2px solid rgba(0, 200, 255, 0.7)',
                                                borderRadius: '12px'
                                            }}
                                            required
                                        />
                                    </div>
                                    <motion.button
                                        className="login-btn"
                                        type="submit"
                                        disabled={isForgotLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem' }}
                                    >
                                        {isForgotLoading ? <span className="spinner"></span> : "Update Password"}
                                    </motion.button>
                                    <button
                                        type="button"
                                        onClick={() => setForgotPasswordStep(1)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'rgba(255,255,255,0.5)',
                                            width: '100%',
                                            marginTop: '1rem',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            textDecoration: 'none',
                                            borderRadius: '12px'
                                        }}
                                    >
                                        Try a different email
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
Login.propTypes = {
    onLoginSuccess: PropTypes.func.isRequired
};

