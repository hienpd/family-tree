'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const bcrypt_promise = require('bcrypt-as-promised');
const knex = require('../knex');

router.post('/users', (req, res, next) => {
  const user = req.body;

  if (!user.first_name || user.first_name.trim() === '') {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('First name missing');
  }
  if (!user.last_name || user.last_name.trim() === '') {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('Last name missing');
  }
  if (!user.email || user.email.trim() === '') {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('Email must not be blank');
  }
  if (!user.password || user.password.trim() === '') {
    return res
      .status(400)
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
        .status(400)
        .set('Content-Type', 'text/plain')
        .send('Email already exists');
    }

    // eslint-disable-next-line camelcase
    return bcrypt_promise.hash(req.body.password, 12);
  })
  .then((hashed_password) => {
    return knex('users')
    .insert({
      first_name: user.first_name,  // eslint-disable-line camelcase
      last_name: user.last_name,    // eslint-disable-line camelcase
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
