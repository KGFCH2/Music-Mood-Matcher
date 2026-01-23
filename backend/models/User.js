const mongoose = require('mongoose')

const favoriteSchema = new mongoose.Schema({
    id: String,
    title: String,
    artist: String,
    language: String,
    mood: String,
    url: String
}, { _id: false })

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    userName: { type: String },
    gender: { type: String, default: 'other' },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    registeredAt: { type: Date, default: Date.now },
    loginHistory: { type: [Date], default: [] },
    favorites: { type: [favoriteSchema], default: [] }
})

module.exports = mongoose.model('User', userSchema)
