'use strict';

const express = require('express');
const router = express.Router();  // eslint-disable-line new-cap
const knex = require('../knex');
const bcrypt_promise = require('bcrypt-as-promised');
const ev = require('express-validation');
const validations = require('../validations/session');

router.post('/session', ev(validations.post), (req, res, next) => {
// TO DO: add validation

  let userId;

  knex('users')
  .where('email', req.body.email)
  .first()
  .then((user) => {
    if (!user) {
      const err = new Error('Unauthorized');
      err.status = 401;

      throw err;
    }

    userId = user.id;

    return bcrypt_promise.compare(req.body.password, user.hashed_password);
  })
  .then(() => {
    req.session.userId = userId;
    res.cookie('loggedIn', true);
    res.sendStatus(200);
  })
  .catch(bcrypt_promise.MISMATCH_ERROR, () => {
    const err = new Error('Unauthorized');
    err.status = 401;

    throw err;
  })
  .catch((err) => {
    next(err);
  });
});

router.delete('/session', (req, res) => {
  req.session = null;
  res.clearCookie('loggedIn');
  res.sendStatus(200);
});

module.exports = router;
