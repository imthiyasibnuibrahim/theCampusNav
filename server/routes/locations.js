const express = require('express');
const Location = require('../models/Location');
const { verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Search locations by name, description, or category
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const locations = await Location.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } }
            ]
        });

        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all locations
router.get('/', async (req, res) => {
    try {
        const locations = await Location.find({});
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new location (For the Admin Panel)
router.post('/', verifyAdmin, async (req, res) => {
    try {
        const { name, description, mappedinPolygonId, category } = req.body;
        const newLocation = new Location({ name, description, mappedinPolygonId, category });
        await newLocation.save();
        res.status(201).json(newLocation);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
