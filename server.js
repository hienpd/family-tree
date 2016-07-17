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
const parents_children = require('./routes/parents_children');
const email = require('./routes/email');

const checkAuth = function(req, res, next) {
  if (!req.session.userId) {
    return res.sendStatus(401);
  }

  next();
};

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

app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    res.render('pages/tree', { email: req.session.email });
  }
  else {
    res.render('pages/index');
  }
});

app.get('/register', (req, res) => {
  res.render('pages/register');
});

app.get('/tree', checkAuth, (req, res) => {
  res.render('pages/tree', { email: req.session.email });
});

app.get('/tree2', checkAuth, (req, res) => {
  res.render('pages/tree2', { email: req.session.email });
});

app.get('/add_self', checkAuth, (req, res) => {
  res.render('pages/add', {
    email: req.session.email, title: 'Add Yourself', isSelf: true
  });
});

app.get('/add_new', checkAuth, (req, res) => {
  res.render('pages/add', {
    email: req.session.email, title: 'Add New Family Member', isSelf: false
  });
});

app.use(express.static(path.join('public')));

app.use(people);
app.use(users);
app.use(session);
app.use(parents_children);
app.use(email);

app.use((_req, res) => {
  res.sendStatus(404);
});

app.use((err, _req, res, _next) => { // eslint-disable-line max-params
  if (err.status) {
    return res.status(err.status).send(err.message);
  }

  res.sendStatus(500);
});

app.listen(port, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Listening on port', port); // eslint-disable-line no-console
  }
});

module.exports = app;
