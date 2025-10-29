const mongoose = require('mongoose');

const scorerSchema = new mongoose.Schema(
  {
    player: String,
    minute: Number,
    team: String
  },
  { _id: false }
);

const matchSchema = new mongoose.Schema(
  {
    teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    score: {
      teamA: { type: Number, default: 0 },
      teamB: { type: Number, default: 0 }
    },
    scorers: [scorerSchema],
    commentary: [String],
    status: {
      type: String,
      enum: ['pending', 'played'],
      default: 'pending'
    },
    stage: {
      type: String,
      enum: ['Quarterfinals', 'Semifinals', 'Final'],
      default: 'Quarterfinals'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Match', matchSchema);
