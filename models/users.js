const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UnauthorisedError = require('../errors/unauthorized-error');
const { wrongEmailOrPasswordMsg, emptyPasswordMsg, emptyEmailMsg } = require('../constants');

const userSchema = mongoose.Schema({
  email: {
    type: mongoose.Schema.Types.String,
    required: [true, emptyEmailMsg],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} неправильный email!`,
    },
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: [true, emptyPasswordMsg],
    select: false,
  },
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorisedError(wrongEmailOrPasswordMsg));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorisedError(wrongEmailOrPasswordMsg));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
