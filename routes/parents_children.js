'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const server = require('../server');
const ev = require('express-validation');
const validations = require('../validations/parents_children');

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

// PATCH /parents_children/c_id
router.patch('/parents_children/:c_id', (req, res, next) => {
  knex('parents_children')
    .where('child_id', req.params.c_id)
    .del()
    .then((res) => {
      console.log('deleted', res);
      console.log('req.body', req.body);
      return knex('parents_children')
        .insert(req.body, '*')
    })
    .then((parents_children) => {
      res.send(parents_children[0]);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
