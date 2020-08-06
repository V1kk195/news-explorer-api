const Users = require('../models/users');

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};
