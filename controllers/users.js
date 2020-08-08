const bcrypt = require('bcryptjs');
const Users = require('../models/users');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getUser = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!password || !password.trim()) {
    throw new BadRequestError('Нужно ввести пароль');
  }

  return bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.send({
        data: {
          email: user.email,
          name: user.name,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError(`Пользователь ${email} уже существует`));
      }
      return next(err);
    });
};
