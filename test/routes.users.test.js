/* globals before:false */
/* globals beforeEach:false */
'use strict';

process.env.NODE_ENV = 'test';

const assert = require('chai').assert;
const { suite, test } = require('mocha');
const bcryptPromise = require('bcrypt-as-promised');
const request = require('supertest');
const knex = require('../knex');
const server = require('../server');

suite('part3 routes users', () => {
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
    knex('users')
      .del()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('POST /users', (done) => {
    const password = 'ilikebigcats';

    request(server)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({
        email: 'john.siracusa@gmail.com',
        password
      })
      .expect('Content-Type', /plain/)
      .expect(200, 'OK')
      .end((httpErr, _res) => {
        if (httpErr) {
          return done(httpErr);
        }

        knex('users')
          .first()
          .then((user) => {
            const hashed_password = user.hashed_password;

            delete user.id;
            delete user.hashed_password;
            delete user.created_at;
            delete user.updated_at;

            assert.deepEqual(user, {
              email: 'john.siracusa@gmail.com'
            });

            return bcryptPromise.compare(password, hashed_password);
          })
          .then(() => {
            done();
          })
          .catch((dbErr) => {
            done(dbErr);
          });
      });
  });
});
