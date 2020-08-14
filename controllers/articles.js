const Articles = require('../models/articles');

const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const {
  incorrectObjIdMsg, sourceNotFoundMsg, unauthorisedArticleDeleteMsg, successArticleDeleteMsg,
} = require('../constants');

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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

module.exports.deleteArticle = (req, res, next) => {
  Articles.findById(req.params.articleId)
    .orFail(new NotFoundError(sourceNotFoundMsg))
    .then((article) => {
      if (!article.owner.equals(req.user._id)) {
        throw new ForbiddenError(unauthorisedArticleDeleteMsg);
      }
      return Articles.deleteOne(article);
    })
    .then(() => res.send({ message: successArticleDeleteMsg }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(incorrectObjIdMsg));
      }
      return next(err);
    });
};
