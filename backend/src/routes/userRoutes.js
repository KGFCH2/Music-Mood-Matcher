import express from 'express';
import {
  saveMoodHistory,
  getMoodHistory,
  getMoodStats,
  addFavorite,
  removeFavorite,
  getFavorites,
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/mood-history', saveMoodHistory);
router.get('/mood-history', getMoodHistory);
router.get('/mood-stats', getMoodStats);

router.post('/favorites', addFavorite);
router.delete('/favorites/:songId', removeFavorite);
router.get('/favorites', getFavorites);

export default router;
