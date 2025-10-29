const Match = require('../models/Match');

const topScorers = async (req, res, next) => {
  try {
    const matches = await Match.find({ status: 'played' });
    const scorerMap = new Map();

    matches.forEach((match) => {
      match.scorers.forEach((scorer) => {
        const key = `${scorer.player}-${scorer.team}`;
        const current = scorerMap.get(key) || { player: scorer.player, team: scorer.team, goals: 0 };
        current.goals += 1;
        scorerMap.set(key, current);
      });
    });

    const leaderboard = Array.from(scorerMap.values()).sort((a, b) => b.goals - a.goals);
    return res.json(leaderboard);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  topScorers
};
