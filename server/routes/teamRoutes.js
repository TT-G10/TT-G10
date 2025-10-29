const express = require('express');
const { body } = require('express-validator');
const {
  createTeam,
  listTeams,
  getTeam,
  updateTeam,
  deleteTeam
} = require('../controllers/teamController');
const auth = require('../middleware/auth');

const router = express.Router();

const playerValidators = [
  body('players').isArray({ min: 23, max: 23 }).withMessage('Exactly 23 players are required'),
  body('players.*.name').isString().notEmpty(),
  body('players.*.position').isIn(['GK', 'DF', 'MD', 'AT']),
  body('players.*.ratings.GK').isInt({ min: 0, max: 100 }),
  body('players.*.ratings.DF').isInt({ min: 0, max: 100 }),
  body('players.*.ratings.MD').isInt({ min: 0, max: 100 }),
  body('players.*.ratings.AT').isInt({ min: 0, max: 100 }),
  body('players.*.captain').optional().isBoolean()
];

router.post(
  '/',
  auth,
  [
    body('name').notEmpty(),
    body('country').notEmpty(),
    body('manager').notEmpty(),
    ...playerValidators
  ],
  createTeam
);

router.get('/', listTeams);
router.get('/:id', getTeam);

router.put(
  '/:id',
  auth,
  [
    body('name').optional().notEmpty(),
    body('country').optional().notEmpty(),
    body('manager').optional().notEmpty(),
    body('players').optional().isArray({ min: 23, max: 23 }),
    body('players.*.name').optional().notEmpty(),
    body('players.*.position').optional().isIn(['GK', 'DF', 'MD', 'AT']),
    body('players.*.ratings.GK').optional().isInt({ min: 0, max: 100 }),
    body('players.*.ratings.DF').optional().isInt({ min: 0, max: 100 }),
    body('players.*.ratings.MD').optional().isInt({ min: 0, max: 100 }),
    body('players.*.ratings.AT').optional().isInt({ min: 0, max: 100 }),
    body('players.*.captain').optional().isBoolean()
  ],
  updateTeam
);

router.delete('/:id', auth, deleteTeam);

module.exports = router;
