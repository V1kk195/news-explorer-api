const mongoose = require('mongoose');
const validator = require('validator');

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
    select: false
  },
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    minlength: 2,
    maxlength: 30,
  }
})

module.exports = mongoose.model('user', userSchema);