'use strict';

exports.seed = function(knex) {
  return knex('people').del()
    .then(() => {
      return knex('people').insert([{
        id: 1,
        first_name: 'Hien',
        middle_name: 'Phuong',
        last_name: 'Dang',
        dob: new Date(1984, 11, 1),
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 2,
        first_name: 'Phung',
        middle_name: 'Thi',
        last_name: 'Dang',
        dob: new Date(1963, 3, 20),
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 3,
        first_name: 'Nicholas',
        middle_name: 'Hoai',
        last_name: 'Nguyen',
        dob: new Date(1995, 2, 5),
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'm'
      },
      {
        id: 4,
        first_name: 'Thach',
        middle_name: 'Van',
        last_name: 'Nguyen',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'm'
      },
      {
        id: 5,
        first_name: 'Lan',
        middle_name: 'Thi',
        last_name: 'Nguyen',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 6,
        first_name: 'Hoi',
        middle_name: 'Van',
        last_name: 'Dang',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'm'
      },
      {
        id: 7,
        first_name: 'Nhung',
        last_name: 'Dang',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 8,
        first_name: 'Hanh',
        last_name: 'Dang',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 9,
        first_name: 'Chi',
        last_name: 'Dang',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 10,
        first_name: 'Tu',
        last_name: 'Dang',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 11,
        first_name: 'Phuc',
        last_name: 'Dang',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 12,
        first_name: 'Thailand',
        last_name: 'Dang',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 13,
        first_name: 'Ricky',
        last_name: 'Saeturn',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'm'
      },
      {
        id: 14,
        first_name: 'Sidney',
        last_name: 'Saeturn',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 15,
        first_name: 'Lily',
        last_name: 'Saeturn',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'f'
      },
      {
        id: 16,
        first_name: 'Nathan',
        last_name: 'Saeturn',
        created_at: new Date("2016-07-08T03:33:59.857Z"),
        updated_at: new Date("2016-07-08T03:33:59.857Z"),
        gender: 'm'
      },
    ]);
    });
};
