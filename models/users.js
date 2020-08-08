const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UnauthorisedError = require('../errors/unauthorized-error');

const userSchema = mongoose.Schema({
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} неправильный email!`,
    },
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: [true, 'Нужно ввести пароль!'],
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
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new UnauthorisedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorisedError('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
