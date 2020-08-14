const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const UnauthorisedError = require('../errors/unauthorized-error');
const { authNeededMsg } = require('../constants');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    if (!req.cookies.jwt) {
      // noinspection ExceptionCaughtLocallyJS
      throw new UnauthorisedError(authNeededMsg);
    }
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnauthorisedError(authNeededMsg));
  }

  req.user = payload;

  next();
};
