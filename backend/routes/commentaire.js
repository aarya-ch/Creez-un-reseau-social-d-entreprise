const express = require('express');
const router = express.Router();

const commentaireCtrl = require('../controllers/commentaire');
const { requireAuth } = require('../middleware/auth');

router.get('/',requireAuth, commentaireCtrl.getAllComments);
router.post('/', requireAuth,commentaireCtrl.createComment);
router.delete('/:id',requireAuth, commentaireCtrl.deleteComment);

module.exports = router;