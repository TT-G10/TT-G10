const Match = require('../models/Match');
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const { simulateMatch } = require('./matchService');

const shuffle = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const createTournamentFixtures = (teams, stage) => {
  const fixtures = [];
  for (let i = 0; i < teams.length; i += 2) {
    const match = new Match({
      teamA: teams[i]._id,
      teamB: teams[i + 1]._id,
      stage
    });
    fixtures.push(match);
  }
  return fixtures;
};

const startTournament = async () => {
  const existing = await Tournament.findOne();
  if (existing) {
    const error = new Error('Tournament already in progress. Reset before starting again.');
    error.status = 400;
    throw error;
  }

  const teams = await Team.find();
  if (teams.length < 8) {
    const error = new Error('At least 8 teams are required to start the tournament');
    error.status = 400;
    throw error;
  }

  const selectedTeams = shuffle(teams).slice(0, 8);
  const fixturesDocs = createTournamentFixtures(selectedTeams, 'Quarterfinals');
  const matches = await Match.insertMany(fixturesDocs);
  const tournament = await Tournament.create({
    stage: 'Quarterfinals',
    fixtures: matches.map((match) => match._id),
    results: []
  });
  return tournament.populate({ path: 'fixtures', populate: ['teamA', 'teamB'] });
};

const progressTournament = async () => {
  const tournament = await Tournament.findOne();
  if (!tournament) {
    const error = new Error('No tournament found');
    error.status = 404;
    throw error;
  }

  const fixtures = await Match.find({ _id: { $in: tournament.fixtures } });
  const remaining = fixtures.filter((match) => match.status !== 'played');
  if (remaining.length) {
    for (const match of remaining) {
      // eslint-disable-next-line no-await-in-loop
      await simulateMatch({ teamAId: match.teamA, teamBId: match.teamB, stage: match.stage });
    }
  }

  const playedMatches = await Match.find({ _id: { $in: tournament.fixtures }, status: 'played' });
  const winners = playedMatches.map((match) => {
    if (match.score.teamA === match.score.teamB) {
      return Math.random() > 0.5 ? match.teamA : match.teamB;
    }
    return match.score.teamA > match.score.teamB ? match.teamA : match.teamB;
  });

  if (tournament.stage === 'Quarterfinals') {
    const fixturesDocs = createTournamentFixtures(await Team.find({ _id: { $in: winners } }), 'Semifinals');
    const matches = await Match.insertMany(fixturesDocs);
    tournament.stage = 'Semifinals';
    tournament.fixtures = matches.map((match) => match._id);
    tournament.results.push(...playedMatches.map((match) => match._id));
  } else if (tournament.stage === 'Semifinals') {
    const fixturesDocs = createTournamentFixtures(await Team.find({ _id: { $in: winners } }), 'Final');
    const matches = await Match.insertMany(fixturesDocs);
    tournament.stage = 'Final';
    tournament.fixtures = matches.map((match) => match._id);
    tournament.results.push(...playedMatches.map((match) => match._id));
  } else if (tournament.stage === 'Final') {
    tournament.results.push(...playedMatches.map((match) => match._id));
    tournament.fixtures = [];
  }

  await tournament.save();
  return tournament.populate({ path: 'fixtures results', populate: ['teamA', 'teamB'] });
};

const resetTournament = async () => {
  await Tournament.deleteMany();
  await Match.deleteMany();
};

module.exports = {
  startTournament,
  progressTournament,
  resetTournament
};
