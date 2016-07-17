/* globals before:false */
/* globals beforeEach:false */
/* eslint-disable quote-props */
'use strict';

process.env.NODE_ENV = 'test';

const { suite, test } = require('mocha');
const knex = require('../knex');
const request = require('supertest');
const server = require('../server');

suite('people suite', () => {
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

  test('GET people route', (done) => {
    request(server)
      .get('/people')
      .expect(200, [{
        "id": 1,
        "given_name": "Bob",
        "middle_name": "",
        "family_name": "Belcher",
        "dob": "1972-03-16T08:00:00.000Z",
        "gender": "m",
        "created_at": "2016-07-08T03:33:59.857Z",
        "updated_at": "2016-07-08T03:33:59.857Z",
        "user_id": null
      }, {
        "id": 2,
        "given_name": "Linda",
        "middle_name": "",
        "family_name": "Belcher",
        "dob": "1972-07-24T07:00:00.000Z",
        "gender": "f",
        "created_at": "2016-07-08T03:33:59.857Z",
        "updated_at": "2016-07-08T03:33:59.857Z",
        "user_id": null
      }, {
        "id": 3,
        "given_name": "Tina",
        "middle_name": "Ruth",
        "family_name": "Belcher",
        "dob": "2003-04-05T08:00:00.000Z",
        "gender": "f",
        "created_at": "2016-07-08T03:33:59.857Z",
        "updated_at": "2016-07-08T03:33:59.857Z",
        "user_id": 1
      }, {
        "id": 4,
        "given_name": "Gene",
        "middle_name": "",
        "family_name": "Belcher",
        "dob": "2005-04-05T07:00:00.000Z",
        "gender": "m",
        "created_at": "2016-07-08T03:33:59.857Z",
        "updated_at": "2016-07-08T03:33:59.857Z",
        "user_id": null
      }, {
        "id": 5,
        "given_name": "Louise",
        "middle_name": "",
        "family_name": "Belcher",
        "dob": "2007-12-25T08:00:00.000Z",
        "gender": "f",
        "created_at": "2016-07-08T03:33:59.857Z",
        "updated_at": "2016-07-08T03:33:59.857Z",
        "user_id": null
      }], done);
  });

  test('GET people/2 route', (done) => {
    request(server)
    .get('/people/2')
    .expect(200,
      {
        "id": 2,
        "given_name": "Linda",
        "middle_name": "",
        "family_name": "Belcher",
        "dob": "1972-07-24T07:00:00.000Z",
        "gender": "f",
        "created_at": "2016-07-08T03:33:59.857Z",
        "updated_at": "2016-07-08T03:33:59.857Z",
        "user_id": null
      }, done);
  });

  test('GET people/15 route', (done) => {
    request(server)
    .get('/people/15')
    .expect(404, done);
  });

  test('GET people/1/children route', (done) => {
    request(server)
    .get('/people/1/children')
    .expect(200, [{ child_id: 3 }, { child_id: 4 }, { child_id: 5 }], done);
  });

  test('GET people/2/children route', (done) => {
    request(server)
    .get('/people/2/children')
    .expect(200, [{ child_id: 3 }, { child_id: 4 }, { child_id: 5 }], done);
  });

  test('GET people/1/parents route', (done) => {
    request(server)
    .get('/people/1/parents')
    .expect(200, [], done);
  });

  test('GET people/5/parents route', (done) => {
    request(server)
    .get('/people/5/parents')
    .expect(200, [{ parent_id: 1 }, { parent_id: 2 }], done);
  });

  test('POST /people', (done) => {
    request(server)
      .post('/people')
      .send({
        given_name: 'Tina',
        middle_name: 'Ruth',
        family_name: 'Belcher',
        dob: '2003-04-05',
        gender: 'f'
      })
      .expect('Content-Type', /json/)
      .expect((res) => {
        delete res.body.created_at;
        delete res.body.updated_at;
      })
      .expect(200, {
        id: 6,
        given_name: 'Tina',
        middle_name: 'Ruth',
        family_name: 'Belcher',
        dob: '2003-04-05T08:00:00.000Z',
        gender: 'f',
        user_id: null
      }, done);
  });
});
