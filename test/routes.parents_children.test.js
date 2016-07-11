'use strict';

process.env.NODE_ENV = 'test';

const assert = require('chai').assert;
const {
  suite,
  test
} = require('mocha');
const knex = require('../knex');
const request = require('supertest');
const server = require('../server');

suite('parents_children route', () => {
  before(function(done) {
    knex.migrate.latest()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  beforeEach(function(done) {
    knex.seed.run()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('POST /parents_children', (done) => {
    request(server)
      .post('/parents_children')
      .send({
        parent_id: 12,
        child_id: 14
      })
      .expect((res) => {
        delete res.body.created_at;
        delete res.body.updated_at;
      })
      .expect(200, {
        id: 18,
        parent_id: 12,
        child_id: 14
      }, done);
  });

});
