const router = require('express').Router();
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');
const { validateCreateArticle, validateParamsArticleId } = require('../middlewares/validation');

router.get('/articles', getArticles);
router.post('/articles', validateCreateArticle, createArticle);
router.delete('/articles/:articleId', validateParamsArticleId, deleteArticle);

module.exports = router;
