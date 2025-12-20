import MoodHistory from '../models/MoodHistory.js';
import User from '../models/User.js';

export const saveMoodHistory = async (req, res, next) => {
  try {
    const { mood, confidence, detectionMethod, songsPlayed } = req.body;

    const moodEntry = new MoodHistory({
      userId: req.user.userId,
      mood,
      confidence,
      detectionMethod,
      songsPlayed,
    });

    await moodEntry.save();

    res.status(201).json({
      success: true,
      message: 'Mood history saved',
      moodEntry,
    });
  } catch (error) {
    next(error);
  }
};

export const getMoodHistory = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const history = await MoodHistory.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    next(error);
  }
};

export const getMoodStats = async (req, res, next) => {
  try {
    const stats = await MoodHistory.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(req.user.userId) } },
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 },
          avgConfidence: { $avg: '$confidence' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const { songId, songName, artist, mood } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFavorited = user.favorites.some((fav) => fav.songId === songId);
    if (isFavorited) {
      return res.status(400).json({ message: 'Song already favorited' });
    }

    user.favorites.push({
      songId,
      songName,
      artist,
      mood,
      addedAt: new Date(),
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Added to favorites',
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { songId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favorites = user.favorites.filter((fav) => fav.songId !== songId);

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Removed from favorites',
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};
