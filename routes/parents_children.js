/* eslint-disable camelcase */
'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const knex = require('../knex');

// POST /parents_children
router.post('/parents_children', (req, res, next) => {
  knex('parents_children')
    .insert(req.body, '*')
    .then((parents_children) => {
      res.send(parents_children[0]);
    })
    .catch((err) => {
      next(err);
    });
});

// GET /parents_children
router.get('/parents_children', (req, res, next) => {
  knex('parents_children')
    .then((parents_children) => {
      res.send(parents_children);
    })
    .catch((err) => {
      next(err);
    });
});

// PATCH /parents_children/c_id
router.patch('/parents_children/:c_id', (req, res, next) => {
  knex('parents_children')
    .where('child_id', req.params.c_id)
    .del()
    .then(() =>
      knex('parents_children')
        .insert(req.body, '*')
    )
    .then((parents_children) => {
      res.send(parents_children[0]);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
