const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const { limiter, mongoAddress } = require('./config');
const errorHandler = require('./middlewares/error-handler');

const whitelist = [
  'http://localhost:8080', 'https://api.explorerofnews.ga', 'http://api.explorerofnews.ga', 'https://explorerofnews.ga',
  'http://explorerofnews.ga', 'https://victoria31f.github.io',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
};

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect(mongoAddress, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
