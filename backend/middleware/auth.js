const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'

function authMiddleware(req, res, next) {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })
    const token = auth.split(' ')[1]
    try {
        const payload = jwt.verify(token, JWT_SECRET)
        req.user = payload
        next()
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' })
    }
}

module.exports = { authMiddleware }
