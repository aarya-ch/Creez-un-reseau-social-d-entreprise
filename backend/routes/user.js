const express = require('express');
const router = express.Router();

const {requireAuth} = require('../middleware/auth');
const userCtrl = require('../controllers/user');

router.get('/me', requireAuth, userCtrl.me);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id',requireAuth, userCtrl.getUserById);
router.delete('/:id', requireAuth, userCtrl.deleteUser);
router.get('/users/:ids',requireAuth, userCtrl.getUsersByIds);

module.exports = router;
