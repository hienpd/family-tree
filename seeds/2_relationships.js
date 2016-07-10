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
      },
      {
        id: 5,
        child_id: 3,
        parent_id: 2
      },
      {
        id: 6,
        child_id: 3,
        parent_id: 4
      },
      {
        id: 8,
        child_id: 7,
        parent_id: 5
      },
      {
        id: 9,
        child_id: 7,
        parent_id: 6
      },
      {
        id: 10,
        child_id: 8,
        parent_id: 5
      },
      {
        id: 11,
        child_id: 8,
        parent_id: 6
      },
      {
        id: 12,
        child_id: 9,
        parent_id: 5
      },
      {
        id: 13,
        child_id: 9,
        parent_id: 6
      },
      {
        id: 14,
        child_id: 10,
        parent_id: 5
      },
      {
        id: 15,
        child_id: 10,
        parent_id: 6
      },
      {
        id: 16,
        child_id: 11,
        parent_id: 5
      },
      {
        id: 17,
        child_id: 11,
        parent_id: 6
      }
      //, {
      //   id: 18,
      //   child_id: 12,
      //   parent_id: 5
      // },
      // {
      //   id: 19,
      //   child_id: 12,
      //   parent_id: 6
      // },
      // {
      //   id: 20,
      //   child_id: 14,
      //   parent_id: 12
      // },
      // {
      //   id: 21,
      //   child_id: 14,
      //   parent_id: 13
      // },
      // {
      //   id: 22,
      //   child_id: 15,
      //   parent_id: 12
      // },
      // {
      //   id: 23,
      //   child_id: 15,
      //   parent_id: 13
      // },
      // {
      //   id: 24,
      //   child_id: 16,
      //   parent_id: 12
      // },
      // {
      //   id: 25,
      //   child_id: 16,
      //   parent_id: 13
      // }
    ]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('relationships_id_seq', (SELECT MAX(id) FROM relationships));"
      );
    });
};
