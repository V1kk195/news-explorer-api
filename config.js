const JWT_DEV = 'dev-secret';

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const mongoAddress = 'mongodb://localhost:27017/news-explorer';

module.exports = {
  JWT_DEV,
  limiter,
  mongoAddress,
};
