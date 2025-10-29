const express = require('express');
const { topScorers } = require('../controllers/leaderboardController');

const router = express.Router();

router.get('/top-scorers', topScorers);

module.exports = router;
