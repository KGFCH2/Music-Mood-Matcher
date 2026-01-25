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

async function profile(req, res, next) {
    try {
        const user = await User.findOne({ userId: req.user.userId }).lean()
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json({ user })
    } catch (err) { next(err) }
}

module.exports = { register, login, profile }
