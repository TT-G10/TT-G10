const getPlayerEffectiveRating = (player) => {
  if (!player || !player.position || !player.ratings) {
    return 0;
  }
  const position = player.position;
  const base = player.ratings[position] || 0;
  const offPositionRatings = Object.entries(player.ratings)
    .filter(([key]) => key !== position)
    .map(([, value]) => value);
  const averageOffPosition = offPositionRatings.reduce((sum, value) => sum + value, 0) /
    (offPositionRatings.length || 1);
  return Math.round(base * 0.7 + averageOffPosition * 0.3);
};

const calculateTeamRating = (players = []) => {
  if (!players.length) {
    return 0;
  }
  const total = players.reduce((sum, player) => sum + getPlayerEffectiveRating(player), 0);
  return Math.round(total / players.length);
};

module.exports = {
  getPlayerEffectiveRating,
  calculateTeamRating
};
