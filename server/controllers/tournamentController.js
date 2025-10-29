const Tournament = require('../models/Tournament');
const Match = require('../models/Match');
const { startTournament, progressTournament, resetTournament } = require('../services/tournamentService');

const start = async (req, res, next) => {
  try {
    const tournament = await startTournament();
    return res.status(201).json(tournament);
  } catch (error) {
    return next(error);
  }
};

const progress = async (req, res, next) => {
  try {
    const tournament = await progressTournament();
    return res.json(tournament);
  } catch (error) {
    return next(error);
  }
};

const reset = async (req, res, next) => {
  try {
    await resetTournament();
    return res.json({ message: 'Tournament reset' });
  } catch (error) {
    return next(error);
  }
};

const bracket = async (req, res, next) => {
  try {
    const tournament = await Tournament.findOne()
      .populate({ path: 'fixtures results', populate: ['teamA', 'teamB'] });
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    return res.json(tournament);
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

module.exports = {
  start,
  progress,
  reset,
  bracket,
  listMatches
};
