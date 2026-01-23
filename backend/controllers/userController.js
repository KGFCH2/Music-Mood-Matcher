const User = require('../models/User')
const MoodHistory = require('../models/MoodHistory')

async function addFavorite(req, res, next) {
  try {
    const { id, title, artist, language, mood, url } = req.body
    const user = await User.findOne({ userId: req.user.userId })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const fav = { id, title, artist, language, mood, url }
    user.favorites = user.favorites || []
    if (!user.favorites.some(f => f.id === id)) user.favorites.push(fav)
    await user.save()
    res.json({ favorites: user.favorites })
  } catch (err) { next(err) }
}

async function removeFavorite(req, res, next) {
  try {
    const { id } = req.params
    const user = await User.findOne({ userId: req.user.userId })
    if (!user) return res.status(404).json({ message: 'User not found' })
    user.favorites = (user.favorites || []).filter(f => f.id !== id)
    await user.save()
    res.json({ favorites: user.favorites })
  } catch (err) { next(err) }
}

async function getFavorites(req, res, next) {
  try {
    const user = await User.findOne({ userId: req.user.userId })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ favorites: user.favorites || [] })
  } catch (err) { next(err) }
}

async function addMoodHistory(req, res, next) {
  try {
    const { mood } = req.body
    const entry = new MoodHistory({ userId: req.user.userId, mood })
    await entry.save()
    res.json({ ok: true })
  } catch (err) { next(err) }
}

async function getMoodHistory(req, res, next) {
  try {
    const entries = await MoodHistory.find({ userId: req.user.userId }).sort({ timestamp: -1 }).limit(100)
    res.json({ history: entries })
  } catch (err) { next(err) }
}

module.exports = { addFavorite, removeFavorite, getFavorites, addMoodHistory, getMoodHistory }
