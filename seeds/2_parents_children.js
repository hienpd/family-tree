'use strict';

exports.seed = function(knex) {
  return knex('parents_children').del()
    .then(() =>
      knex('parents_children').insert([{
        id: 1,
        child_id: 3,
        parent_id: 1
      }, {
        id: 2,
        child_id: 3,
        parent_id: 2
      }, {
        id: 3,
        child_id: 4,
        parent_id: 1
      }, {
        id: 4,
        child_id: 4,
        parent_id: 2
      }, {
        id: 5,
        child_id: 5,
        parent_id: 1
      }, {
        id: 6,
        child_id: 5,
        parent_id: 2
      }])
    )
    .then(() =>
      knex.raw(
        `SELECT setval('parents_children_id_seq',
        (SELECT MAX(id) FROM parents_children));`
      )
    );
};
