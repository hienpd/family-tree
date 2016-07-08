'use strict';

exports.seed = function(knex) {
  return knex('relationships').del()
    .then(() => {
      return knex('relationships').insert([{
        id: 1,
        child_id: 1,
        parent_id: 2
      },
      {
        id: 2,
        child_id: 1,
        parent_id: 4
      },
      {
        id: 3,
        child_id: 2,
        parent_id: 5
      },
      {
        id: 4,
        child_id: 2,
        parent_id: 6
      },
      {
        id: 5,
        child_id: 3,
        parent_id: 2
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
