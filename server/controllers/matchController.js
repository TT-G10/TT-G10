const { validationResult } = require('express-validator');
const Match = require('../models/Match');
const { simulateMatch } = require('../services/matchService');

const simulate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { teamA, teamB, stage } = req.body;
    const match = await simulateMatch({ teamAId: teamA, teamBId: teamB, stage });
    return res.status(201).json(match);
  } catch (error) {
    return next(error);
  }
};

const listMatches = async (req, res, next) => {
  try {
    const matches = await Match.find().populate(['teamA', 'teamB']);
    return res.json(matches);
  } catch (error) {
    return next(error);
  }
};

const getMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id).populate(['teamA', 'teamB']);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    return res.json(match);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  simulate,
  listMatches,
  getMatch
};
