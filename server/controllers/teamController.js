const { validationResult } = require('express-validator');
const Team = require('../models/Team');
const { calculateTeamRating } = require('../utils/rating');

const createTeam = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const payload = req.body;
    payload.createdBy = req.user.id;
    payload.rating = calculateTeamRating(payload.players);
    const team = await Team.create(payload);
    return res.status(201).json(team);
  } catch (error) {
    return next(error);
  }
};

const listTeams = async (req, res, next) => {
  try {
    const teams = await Team.find().populate('createdBy', 'username email role');
    return res.json(teams);
  } catch (error) {
    return next(error);
  }
};

const getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate('createdBy', 'username email role');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    return res.json(team);
  } catch (error) {
    return next(error);
  }
};

const updateTeam = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (req.user.role !== 'admin' && String(team.createdBy) !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own team' });
    }

    Object.assign(team, req.body);
    if (req.body.players) {
      team.rating = calculateTeamRating(req.body.players);
    }

    await team.save();
    return res.json(team);
  } catch (error) {
    return next(error);
  }
};

const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    if (req.user.role !== 'admin' && String(team.createdBy) !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own team' });
    }
    await team.deleteOne();
    return res.json({ message: 'Team deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createTeam,
  listTeams,
  getTeam,
  updateTeam,
  deleteTeam
};
