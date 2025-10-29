const Match = require('../models/Match');
const Team = require('../models/Team');
const { generateCommentary } = require('./aiService');
const { sendMatchSummaryEmail } = require('./emailService');

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const pickScorers = (team, goals) => {
  if (!team || !team.players) {
    return [];
  }
  const scorers = [];
  for (let i = 0; i < goals; i += 1) {
    const player = team.players[getRandomInt(0, team.players.length - 1)];
    scorers.push({
      player: player.name,
      minute: getRandomInt(5, 90),
      team: team.name
    });
  }
  return scorers;
};

const simulateMatch = async ({ teamAId, teamBId, stage = 'Quarterfinals' }) => {
  const [teamA, teamB] = await Promise.all([
    Team.findById(teamAId),
    Team.findById(teamBId)
  ]);

  if (!teamA || !teamB) {
    const error = new Error('Both teams must exist to simulate a match');
    error.status = 404;
    throw error;
  }

  const teamAScore = getRandomInt(0, 4);
  const teamBScore = getRandomInt(0, 4);

  const scorers = [
    ...pickScorers(teamA, teamAScore),
    ...pickScorers(teamB, teamBScore)
  ].sort((a, b) => a.minute - b.minute);

  const commentaryContext = `${teamA.name} ${teamAScore}-${teamBScore} ${teamB.name}. ` +
    `Goals: ${scorers.map((s) => `${s.player} (${s.team})`).join(', ') || 'None'}`;
  const commentary = await generateCommentary(commentaryContext);

  const match = await Match.create({
    teamA: teamA._id,
    teamB: teamB._id,
    score: { teamA: teamAScore, teamB: teamBScore },
    scorers,
    commentary,
    status: 'played',
    stage
  });

  await sendMatchSummaryEmail({
    recipients: [teamA.manager, teamB.manager].join(', '),
    subject: `${teamA.name} ${teamAScore}-${teamBScore} ${teamB.name}`,
    text: `Final score: ${teamAScore}-${teamBScore}. Scorers: ${scorers.map((s) => `${s.player} ${s.minute}'`).join(', ') || 'None'}`
  });

  return match;
};

module.exports = {
  simulateMatch
};
