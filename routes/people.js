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

// GET /people/:id/children
router.get('/people/:id/children', (req, res, next) => {
  knex('people')
    .join('relationships', 'relationships.child_id', '=', 'people.id')
    .where('parent_id', req.params.id)
    .select('child_id')
    .then((children) => {
      res.send(children);
    })
    .catch((err) => {
      next(err);
    });
});

// GET /people/:id/parents

module.exports = router;
