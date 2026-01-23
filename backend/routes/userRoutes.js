const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middleware/auth')
const userController = require('../controllers/userController')

router.use(authMiddleware)

router.get('/favorites', userController.getFavorites)
router.post('/favorites', userController.addFavorite)
router.delete('/favorites/:id', userController.removeFavorite)

router.post('/mood-history', userController.addMoodHistory)
router.get('/mood-history', userController.getMoodHistory)

module.exports = router
