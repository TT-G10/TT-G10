const express = require('express');
const allowRoles = require('../middleware/roles');
const auth = require('../middleware/auth');
const {
  start,
  progress,
  reset,
  bracket
} = require('../controllers/tournamentController');

const router = express.Router();

router.post('/start', auth, allowRoles('admin'), start);
router.post('/progress', auth, allowRoles('admin'), progress);
router.post('/reset', auth, allowRoles('admin'), reset);
router.get('/bracket', bracket);

module.exports = router;
