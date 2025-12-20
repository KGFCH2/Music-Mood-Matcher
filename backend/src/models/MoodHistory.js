import mongoose from 'mongoose';

const moodHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mood: {
      type: String,
      enum: ['Happy', 'Sad', 'Energetic', 'Romantic', 'Chill', 'Angry'],
      required: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
    },
    detectionMethod: {
      type: String,
      enum: ['face', 'manual', 'quiz'],
      default: 'manual',
    },
    songsPlayed: [
      {
        songId: String,
        songName: String,
        playedAt: Date,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Auto-delete old records after 90 days
moodHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

export default mongoose.model('MoodHistory', moodHistorySchema);
