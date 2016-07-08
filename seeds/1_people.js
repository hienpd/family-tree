'use strict';

exports.seed = function(knex) {
  return knex('people').del()
    .then(() => {
      return knex('people').insert([{
        id: 1,
        first_name: 'Hien',
        last_name: 'Dang',
        dob: new Date(1984, 11, 1),
        gender: 'f'
      },
      {
        id: 2,
        first_name: 'Phung',
        last_name: 'Dang',
        dob: new Date(1963, 3, 20),
        gender: 'f'
      },
      {
        id: 3,
        first_name: 'Hoai',
        last_name: 'Nguyen',
        dob: new Date(1995, 2, 5),
        gender: 'm'
      },
      {
        id: 4,
        first_name: 'Thach',
        last_name: 'Nguyen',
        dob: new Date(1900, 1, 1),
        gender: 'm'
      },
      {
        id: 5,
        first_name: 'Lan',
        last_name: 'Dang',
        dob: new Date(1900, 1, 1),
        gender: 'f'
      },
      {
        id: 6,
        first_name: 'Hoi',
        last_name: 'Dang',
        dob: new Date(1900, 1, 1),
        gender: 'm'
      },
      {
        id: 7,
        first_name: 'Nhung',
        last_name: 'Dang',
        dob: new Date(1900, 1, 1),
        gender: 'f'
      }]);
    });
};
