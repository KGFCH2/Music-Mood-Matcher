const mongoose = require('mongoose')

const moodHistorySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    mood: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('MoodHistory', moodHistorySchema)
