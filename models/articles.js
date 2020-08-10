const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = mongoose.Schema({
  keyword: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  text: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  date: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  source: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  link: {
    type: mongoose.Schema.Types.String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: (props) => `${props.value} некорректный URL!`,
    },
  },
  image: {
    type: mongoose.Schema.Types.String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: (props) => `${props.value} некорректный URL!`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('article', articleSchema);
