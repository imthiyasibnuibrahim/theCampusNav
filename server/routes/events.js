const express = require('express');
const Event = require('../models/Event');
const { verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
    try {
        // Populate the locationId to get location details with the event
        const events = await Event.find({}).populate('locationId', 'name mappedinPolygonId');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new event
router.post('/', verifyAdmin, async (req, res) => {
    try {
        const { title, description, date, locationId, createdBy } = req.body;
        const newEvent = new Event({ title, description, date, locationId, createdBy });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update an event
router.put('/:id', verifyAdmin, async (req, res) => {
    try {
        const { title, description, date, locationId } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { title, description, date, locationId },
            { new: true }
        );
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete an event
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
