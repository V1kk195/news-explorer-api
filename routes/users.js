const router = require('express').Router();
const { getUser, logout } = require('../controllers/users');

router.get('/users/me', getUser);
router.post('/logout', logout);

module.exports = router;
