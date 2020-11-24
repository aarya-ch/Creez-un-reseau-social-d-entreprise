const express = require('express');
const router = express.Router();
const articleCtrl = require('../controllers/article');
const upload = require('../middleware/upload');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, articleCtrl.getAllArticles);
router.post('/', requireAuth,upload, articleCtrl.createArticle);
router.get('/:id', requireAuth, articleCtrl.getOneArticle);
router.get('/:id/comments', requireAuth, articleCtrl.getArticleComments);
router.post('/:id',requireAuth, upload, articleCtrl.modifyArticle);
router.delete('/:id_article', requireAuth, articleCtrl.deleteArticle);

module.exports = router;