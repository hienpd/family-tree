/* global before: false */
/* global beforeEach: false */
'use strict';

process.env.NODE_ENV = 'test';

const {
  suite,
  test
} = require('mocha');
const knex = require('../knex');
const request = require('supertest');
const server = require('../server');

suite('parents_children route', () => {
  before((done) => {
    knex.migrate.latest()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  beforeEach((done) => {
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
        parent_id: null,
        child_id: 5
      })
      .expect((res) => {
        delete res.body.created_at;
        delete res.body.updated_at;
      })
      .expect(200, {
        id: 7,
        parent_id: null,
        child_id: 5
      }, done);
  });
});
