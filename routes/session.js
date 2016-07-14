'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt_promise = require('bcrypt-as-promised');
const ev = require('express-validation');
const validations = require('../validations/session');

router.post('/session', ev(validations.post), (req, res, next) => {

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
    req.session.email = req.body.email;
    res.cookie('family-tree-userId', userId);
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
  res.clearCookie('family-tree-userId');
  res.sendStatus(200);
});

module.exports = router;
