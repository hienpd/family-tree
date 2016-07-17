'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const knex = require('../knex');
const ev = require('express-validation');
const validations = require('../validations/people');

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
      if (!person) {
        const err = new Error(`/people/${req.params.id} not found`);

        err.status = 404;
        throw err;
      }
      res.send(person);
    })
    .catch((err) => {
      next(err);
    });
});

// GET /people/:id/children
router.get('/people/:id/children', (req, res, next) => {
  knex('people')
    .join('parents_children', 'parents_children.child_id', '=', 'people.id')
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
router.get('/people/:id/parents', (req, res, next) => {
  knex('people')
    .join('parents_children', 'parents_children.parent_id', 'people.id')
    .where('child_id', req.params.id)
    .select('parent_id')
    .then((parents) => {
      res.send(parents);
    })
    .catch((err) => {
      next(err);
    });
});

// POST /people
router.post('/people', ev(validations.post), (req, res, next) => {
  knex('people')
    .insert(req.body, '*')
    .then((people) => {
      res.send(people[0]);
    })
    .catch((err) => {
      next(err);
    });
});

// PATCH /people/id
router.patch('/people/:id', ev(validations.patch), (req, res, next) => {
  knex('people')
    .where('id', req.params.id)
    .update(req.body, '*')
    .then((people) => {
      res.send(people[0]);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
