'use strict';

exports.seed = function(knex) {
  return knex('people').del()
    .then(() => {
      return knex('people').insert([{
        id: 1,
        given_name: 'Hien',
        middle_name: 'Phuong',
        family_name: 'Dang',
        dob: new Date(1984, 11, 1),
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 2,
        given_name: 'Phung',
        middle_name: 'Thi',
        family_name: 'Dang',
        dob: new Date(1963, 3, 20),
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 3,
        given_name: 'Nicholas',
        middle_name: 'Hoai',
        family_name: 'Nguyen',
        dob: new Date(1995, 2, 5),
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'm'
      },
      {
        id: 4,
        given_name: 'Thach',
        middle_name: 'Van',
        family_name: 'Nguyen',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'm'
      },
      {
        id: 5,
        given_name: 'Lan',
        middle_name: 'Thi',
        family_name: 'Nguyen',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 6,
        given_name: 'Hoi',
        middle_name: 'Van',
        family_name: 'Dang',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'm'
      },
      {
        id: 7,
        given_name: 'Nhung',
        family_name: 'Dang',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 8,
        given_name: 'Hanh',
        family_name: 'Dang',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 9,
        given_name: 'Chi',
        family_name: 'Dang',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 10,
        given_name: 'Tu',
        family_name: 'Dang',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 11,
        given_name: 'Phuc',
        family_name: 'Dang',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 12,
        given_name: 'Thailand',
        family_name: 'Dang',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 13,
        given_name: 'Ricky',
        family_name: 'Saeturn',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'm'
      },
      {
        id: 14,
        given_name: 'Sidney',
        family_name: 'Saeturn',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 15,
        given_name: 'Lily',
        family_name: 'Saeturn',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 16,
        given_name: 'Nathan',
        family_name: 'Saeturn',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'm'
      },
    ]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('people_id_seq', (SELECT MAX(id) FROM people));"
      );
    });
};
