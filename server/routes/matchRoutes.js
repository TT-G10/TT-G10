const express = require('express');
const { body } = require('express-validator');
const { simulate, listMatches, getMatch } = require('../controllers/matchController');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');

const router = express.Router();

router.post(
  '/simulate',
  auth,
  allowRoles('admin'),
  [
    body('teamA').isMongoId(),
    body('teamB').isMongoId(),
    body('stage').optional().isIn(['Quarterfinals', 'Semifinals', 'Final'])
  ],
  simulate
);

router.get('/', listMatches);
router.get('/:id', getMatch);

module.exports = router;
