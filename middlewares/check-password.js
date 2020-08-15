const BadRequestError = require('../errors/bad-request-error');
const { emptyPasswordMsg } = require('../constants');

const checkPassword = (req, res, next) => {
  const { password } = req.body;

  if (!password || !password.trim()) {
    throw new BadRequestError(emptyPasswordMsg);
  }
  next();
};

module.exports = checkPassword;
