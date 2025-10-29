const mongoose = require('mongoose');
const playerSchema = require('./Player');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    manager: {
      type: String,
      required: true,
      trim: true
    },
    players: {
      type: [playerSchema],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length === 23;
        },
        message: 'A team must register exactly 23 players'
      }
    },
    rating: {
      type: Number,
      min: 0,
      max: 100
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
