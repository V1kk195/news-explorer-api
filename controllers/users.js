const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.getUser = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`Неправильный формат ID юзера ${req.params.id}`));
      }
      return next(err);
    });
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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: 3600 * 24 * 7 },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch((err) => next(err));
};
