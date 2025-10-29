const mongoose = require('mongoose');

const ratingValidator = {
  validator(value) {
    return value >= 0 && value <= 100;
  },
  message: 'Player rating must be between 0 and 100'
};

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      enum: ['GK', 'DF', 'MD', 'AT'],
      required: true
    },
    ratings: {
      GK: { type: Number, required: true, validate: ratingValidator },
      DF: { type: Number, required: true, validate: ratingValidator },
      MD: { type: Number, required: true, validate: ratingValidator },
      AT: { type: Number, required: true, validate: ratingValidator }
    },
    captain: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

module.exports = playerSchema;
