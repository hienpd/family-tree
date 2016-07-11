'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ silent: true });
}

const express = require('express');
const path = require('path');
const port = process.env.PORT || 8000;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const people = require('./routes/people');
const users = require('./routes/users');
const session = require('./routes/session');
const relationships = require('./routes/relationships');

const app = express();
module.exports = app;

app.set('view engine', 'ejs');

app.disable('x-powered-by');

if (process.env.NODE_ENV !== 'test') {
  const morgan = require('morgan');
  app.use(morgan('short'));
}

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieSession({
  name: 'family_tree',
  secret: process.env.SESSION_SECRET
}));

app.get('/', (_req, res) => {
  res.render('pages/index');
});

app.get('/register', (_req, res) => {
  res.render('pages/register');
});

app.get('/tree', (_req, res) => {
  res.render('pages/tree');
});

app.use(express.static(path.join('public')));

app.use(people);
app.use(users);
app.use(session);
app.use(relationships)

app.use((_req, res) => {
  res.sendStatus(404);
});

app.use((err, _req, res, _next) => {
  if (err.status) {
    return res.status(err.status).send(err);
  }

  console.error(err.stack);
  res.sendStatus(500);
});

app.listen(port, () => {
  if (process.env.NODE_ENV !== 'test') {

    console.log('Listening on port', port);
  }
});

module.exports = app;
