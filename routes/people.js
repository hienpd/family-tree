'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const server = require('../server');

// GET /people
router.get('/people', (_req, res, next) => {
  knex('people')
    .then((people) => {
      res.send(people);
    })
    .catch((err) => {
      next(err);
    });
});

// GET /people/:id
router.get('/people/:id', (req, res, next) => {
  knex('people')
    .where('id', req.params.id)
    .first()
    .then((person) => {
      res.send(person);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
