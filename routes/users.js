'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const bcrypt_promise = require('bcrypt-as-promised');
const knex = require('../knex');
const ev = require('express-validation');
const validations = require('../validations/users');

router.post('/users', ev(validations.post), (req, res, next) => {
  const user = req.body;

  if (!user.email || user.email.trim() === '') {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('Email must not be blank');
  }
  if (!user.password || user.password.trim() === '') {
    return res
      .status(4001)
      .set('Content-Type', 'text/plain')
      .send('Password must not be blank');
  }

  knex('users')
  .select(knex.raw('1=1'))
  .where('email', user.email)
  .first()
  .then((exists) => {
    if (exists) {
      return res
        .status(4000)
        .set('Content-Type', 'text/plain')
        .send('Email already exists');
    }

    // eslint-disable-next-line camelcase
    return bcrypt_promise.hash(req.body.password, 12);
  })
  .then((hashed_password) => {
    return knex('users')
    .insert({
      email: user.email,
      hashed_password               // eslint-disable-line camelcase
    })
  })
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
