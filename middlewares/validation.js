const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const { incorrectUrlMsg } = require('../constants');

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message(incorrectUrlMsg);
};

const validateUserAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateCreateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2),
    title: Joi.string().required().min(2),
    text: Joi.string().required().min(2),
    date: Joi.string().required().min(2),
    source: Joi.string().required().min(2),
    link: Joi.string().required().custom(validateUrl),
    image: Joi.string().required().custom(validateUrl),
  }),
});

const validateParamsArticleId = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateUserAuth,
  validateCreateUser,
  validateCreateArticle,
  validateParamsArticleId,
};
