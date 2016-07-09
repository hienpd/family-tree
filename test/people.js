'use strict';

process.env.NODE_ENV = 'test';

const assert = require('chai').assert;
const {suite, test} = require('mocha');
const knex = require('../knex');
const request = require('supertest');

suite('people', () => {
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

  test('GET people route', (done) => {
    request(server)
      .get('/people')
      .expect(200, [{
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": "1984-12-01T08:00:00.000Z",
        "first_name": "Hien",
        "gender": "f",
        "id": 1,
        "last_name": "Dang",
        "middle_name": "Phuong",
        "updated_at": "2016-07-08T18:23:30.340Z"
    },
    {
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": "1963-04-20T07:00:00.000Z",
        "first_name": "Phung",
        "gender": "f",
        "id": 2,
        "last_name": "Dang",
        "middle_name": "Thi",
        "updated_at": "2016-07-08T18:23:30.340Z"
    },
    {
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": "1995-03-05T08:00:00.000Z",
        "first_name": "Nicholas",
        "gender": "m",
        "id": 3,
        "last_name": "Nguyen",
        "middle_name": "Hoai",
        "updated_at": "2016-07-08T18:23:30.340Z"
    },
    {
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": null,
        "first_name": "Thach",
        "gender": "m",
        "id": 4,
        "last_name": "Nguyen",
        "middle_name": "Van",
        "updated_at": "2016-07-08T18:23:30.340Z"
    },
    {
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": null,
        "first_name": "Lan",
        "gender": "f",
        "id": 5,
        "last_name": "Nguyen",
        "middle_name": "Thi",
        "updated_at": "2016-07-08T18:23:30.340Z"
    },
    {
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": null,
        "first_name": "Hoi",
        "gender": "m",
        "id": 6,
        "last_name": "Dang",
        "middle_name": "Van",
        "updated_at": "2016-07-08T18:23:30.340Z"
    },
    {
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": null,
        "first_name": "Nhung",
        "gender": "f",
        "id": 7,
        "last_name": "Dang",
        "middle_name": "",
        "updated_at": "2016-07-08T18:23:30.340Z"
    },
    {
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": null,
        "first_name": "Hanh",
        "gender": "f",
        "id": 8,
        "last_name": "Dang",
        "middle_name": "",
        "updated_at": "2016-07-08T18:23:30.340Z"
    },
    {
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": null,
        "first_name": "Chi",
        "gender": "f",
        "id": 9,
        "last_name": "Dang",
        "middle_name": "",
        "updated_at": "2016-07-08T18:23:30.340Z"
    },
    {
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": null,
        "first_name": "Tu",
        "gender": "f",
        "id": 10,
        "last_name": "Dang",
        "middle_name": "",
        "updated_at": "2016-07-08T18:23:30.340Z"
    },
    {
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": null,
        "first_name": "Phuc",
        "gender": "f",
        "id": 11,
        "last_name": "Dang",
        "middle_name": "",
        "updated_at": "2016-07-08T18:23:30.340Z"
    },
    {
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": null,
        "first_name": "Thailand",
        "gender": "f",
        "id": 12,
        "last_name": "Dang",
        "middle_name": "",
        "updated_at": "2016-07-08T18:23:30.340Z"
    },
    {
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": null,
        "first_name": "Ricky",
        "gender": "m",
        "id": 13,
        "last_name": "Saeturn",
        "middle_name": "",
        "updated_at": "2016-07-08T18:23:30.340Z"
    },
    {
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": null,
        "first_name": "Sidney",
        "gender": "f",
        "id": 14,
        "last_name": "Saeturn",
        "middle_name": "",
        "updated_at": "2016-07-08T18:23:30.340Z"
    },
    {
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": null,
        "first_name": "Lily",
        "gender": "f",
        "id": 15,
        "last_name": "Saeturn",
        "middle_name": "",
        "updated_at": "2016-07-08T18:23:30.340Z"
    },
    {
        "created_at": "2016-07-08T18:23:30.340Z",
        "dob": null,
        "first_name": "Nathan",
        "gender": "m",
        "id": 16,
        "last_name": "Saeturn",
        "middle_name": "",
        "updated_at": "2016-07-08T18:23:30.340Z"
    }]);
  });
});
