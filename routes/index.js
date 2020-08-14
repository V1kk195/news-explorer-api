const router = require('express').Router();

const users = require('./users');
const articles = require('./articles');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-error');
const { validateUserAuth, validateCreateUser } = require('../middlewares/validation');
const checkPassword = require('../middlewares/check-password');

router.post('/signup', checkPassword, validateCreateUser, createUser);
router.post('/signin', checkPassword, validateUserAuth, login);

router.use(auth);

router.use('/', users);
router.use('/', articles);
router.all('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
