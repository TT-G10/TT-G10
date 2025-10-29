const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      enum: ['Quarterfinals', 'Semifinals', 'Final'],
      default: 'Quarterfinals'
    },
    fixtures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
    results: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tournament', tournamentSchema);
