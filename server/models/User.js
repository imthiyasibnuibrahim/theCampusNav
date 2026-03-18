const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ['student', 'staff', 'visitor', 'admin'],
    default: 'visitor'
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
