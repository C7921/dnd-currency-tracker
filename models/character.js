const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  currency: {
    copper: {
      type: Number,
      default: 0
    },
    silver: {
      type: Number,
      default: 0
    },
    electrum: {
      type: Number,
      default: 0
    },
    gold: {
      type: Number,
      default: 0
    },
    platinum: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Character', CharacterSchema);
