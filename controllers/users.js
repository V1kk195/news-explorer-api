const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_DEV } = require('../config');

const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const {
  userNotFoundMsg, incorrectObjIdMsg, existingUserMsg, existingEmailErrCode,
} = require('../constants');

module.exports.getUser = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(new NotFoundError(userNotFoundMsg))
    .then((user) => {
      res
        .set({
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        })
        .send({
          data: {
            email: user.email,
            name: user.name,
          },
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(incorrectObjIdMsg));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.status(201).send({
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
      if (err.name === 'MongoError' && err.code === existingEmailErrCode) {
        next(new ConflictError(existingUserMsg(email)));
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
        NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV,
        { expiresIn: 3600 * 24 * 7 },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'None',
          secure: true,
          // sameSite: true,
        })
        .send({
          data: {
            email: user.email,
            name: user.name,
          },
        })
        .end();
    })
    .catch(next);
};
