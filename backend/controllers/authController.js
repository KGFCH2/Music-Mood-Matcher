const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

async function register(req, res, next) {
    try {
        const { email, password, userName, gender } = req.body
        if (!email) return res.status(400).json({ message: 'Email required' })

        const existing = await User.findOne({ email })
        if (existing) return res.status(409).json({ message: 'Email already registered' })

        const userId = `u_${Date.now()}`
        const hashed = password ? await bcrypt.hash(password, 10) : undefined

        const user = new User({ userId, email, password: hashed, userName, gender })
        await user.save()

        const token = jwt.sign({ userId: user.userId, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
        res.json({ token, user: { userId: user.userId, email: user.email, userName: user.userName } })
    } catch (err) { next(err) }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(401).json({ message: 'Invalid credentials' })

        if (user.password) {
            const ok = await bcrypt.compare(password || '', user.password)
            if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
        }

        // record login time
        user.loginHistory = user.loginHistory || []
        user.loginHistory.push(new Date())
        await user.save()

        // Log login history to console
        console.log(`User ${user.email} logged in at ${new Date().toISOString()}`)
        console.log(`Login history for ${user.email}:`)
        user.loginHistory.forEach((loginTime, index) => {
            console.log(`  ${index + 1}. ${loginTime.toISOString()}`)
        })

        const token = jwt.sign({ userId: user.userId, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
        res.json({ token, user: { userId: user.userId, email: user.email, userName: user.userName, loginHistory: user.loginHistory } })
    } catch (err) { next(err) }
}

async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body
        if (!email) return res.status(400).json({ message: 'Email required' })

        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: 'No user found with this email' })

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString()

        // Hash the code before storing (for security)
        const codeHash = await bcrypt.hash(code, 10)

        user.resetPasswordCode = codeHash
        user.resetPasswordExpires = Date.now() + 600000 // 10 minutes
        await user.save()

        // NOTE: The code is NOT returned to the client for security reasons.
        // The code will be sent via email backend (email service integration).
        // Client receives only a confirmation that email was sent.
        res.json({ message: 'Verification code has been sent to your registered email. Please check your inbox.', userName: user.userName })
    } catch (err) { next(err) }
}

async function resetPassword(req, res, next) {
    try {
        const { email, code, newPassword } = req.body
        if (!email || !code || !newPassword) return res.status(400).json({ message: 'All fields required' })

        const user = await User.findOne({
            email,
            resetPasswordExpires: { $gt: Date.now() }
        })

        if (!user) return res.status(400).json({ message: 'Invalid or expired reset code' })

        // Compare the provided code with the hashed code stored in DB
        const isCodeValid = await bcrypt.compare(code, user.resetPasswordCode)
        if (!isCodeValid) return res.status(400).json({ message: 'Invalid verification code' })

        // Hash new password
        user.password = await bcrypt.hash(newPassword, 10)
        user.resetPasswordCode = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        res.json({ message: 'Password successfully updated' })
    } catch (err) { next(err) }
}

async function profile(req, res, next) {
    try {
        const user = await User.findOne({ userId: req.user.userId }).lean()
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json({ user })
    } catch (err) { next(err) }
}

module.exports = { register, login, profile, forgotPassword, resetPassword }
