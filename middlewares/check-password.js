const BadRequestError = require('../errors/bad-request-error');

const checkPassword = (req, res, next) => {
  const { password } = req.body;

  if (!password || !password.trim()) {
    throw new BadRequestError('Нужно ввести пароль');
  }
  next();
};

module.exports = checkPassword;
