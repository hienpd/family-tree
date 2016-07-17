'use strict';

exports.seed = function(knex) {
  return knex('people').del()
    .then(() =>
      knex('people').insert([{
        id: 1,
        given_name: 'Bob',
        family_name: 'Belcher',
        dob: new Date(1972, 2, 16),
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'm'
      }, {
        id: 2,
        given_name: 'Linda',
        family_name: 'Belcher',
        dob: new Date(1972, 6, 24),
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      }, {
        id: 3,
        given_name: 'Tina',
        middle_name: 'Ruth',
        family_name: 'Belcher',
        dob: new Date(2003, 3, 5),
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f',
        user_id: 1
      }, {
        id: 4,
        given_name: 'Gene',
        family_name: 'Belcher',
        dob: new Date(2005, 3, 5),
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'm'
      }, {
        id: 5,
        given_name: 'Louise',
        family_name: 'Belcher',
        dob: new Date(2007, 11, 25),
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      }])
    )
    .then(() =>
      knex.raw(
        "SELECT setval('people_id_seq', (SELECT MAX(id) FROM people));"
      )
    );
};
