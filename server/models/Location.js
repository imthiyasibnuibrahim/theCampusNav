const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mappedinPolygonId: {
    type: String,
    required: true,
    index: true // Indexed for faster search queries
  },
  category: {
    type: String,
    enum: ['classroom', 'lab', 'office', 'facility', 'amenity'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
