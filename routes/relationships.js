'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const server = require('../server');

// POST /relationships
router.post('/relationships', (req, res, next) => {
  knex('relationships')
    .insert(req.body, '*')
    .then((relationships) => {
      res.send(relationships[0]);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
