const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Get User's Favorite Locations
router.get('/favorites', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('favorites');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving favorites', error: error.message });
    }
});

// Toggle Favorite Location
router.post('/favorites/:locationId', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { locationId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const favoriteIndex = user.favorites.indexOf(locationId);
        let message = '';

        if (favoriteIndex === -1) {
            // Not in favorites, so add it
            user.favorites.push(locationId);
            message = 'Location added to favorites';
        } else {
            // Already in favorites, so remove it
            user.favorites.splice(favoriteIndex, 1);
            message = 'Location removed from favorites';
        }

        await user.save();

        // Return the updated list of stringified Object IDs
        res.json({ message, favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: 'Server error when toggling favorite', error: error.message });
    }
});

module.exports = router;
