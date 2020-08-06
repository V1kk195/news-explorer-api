const Articles = require('../models/articles');

module.exports.getArticles = (req, res, next) => {
  Articles.find({})
    .then((articles) => {
      res.send({ data: articles });
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Articles.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => {
      res.send({ data: article });
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Articles.findById(req.params.articleId)
    .orFail()
    .then((article) => {
      if (!article.owner.equals(req.user._id)) {
        return Promise.reject(new ForbiddenError('Вы пытаетесь удалить чужую статью'));
      }
      return Articles.deleteOne(article);
    })
    .catch(next);
};
