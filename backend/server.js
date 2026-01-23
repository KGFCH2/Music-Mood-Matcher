require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./db')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()
app.use(cors())
app.use(express.json())

// Connect to database
connectDB().catch(err => {
    console.error('Database connection error', err)
    process.exit(1)
})

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
