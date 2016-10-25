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
      }, { // new
        id: 7,
        child_id: 7,
        parent_id: 6
      }, {
        id: 8,
        child_id: 8,
        parent_id: 4
      }, {
        id: 9,
        child_id: 8,
        parent_id: 6
      }, {
        id: 10,
        child_id: 9,
        parent_id: 4
      }, {
        id: 11,
        child_id: 9,
        parent_id: 6
      }, {
        id: 12,
        child_id: 10,
        parent_id: 1
      }, {
        id: 13,
        child_id: 12,
        parent_id: 10
      }, {
        id: 14,
        child_id: 12,
        parent_id: 11
      }, {
        id: 15,
        child_id: 13,
        parent_id: 10
      }, {
        id: 16,
        child_id: 13,
        parent_id: 11
      }, {
        id: 17,
        child_id: 14,
        parent_id: 10
      }, {
        id: 18,
        child_id: 14,
        parent_id: 11
      }])
    )
    .then(() =>
      knex.raw(
        `SELECT setval('parents_children_id_seq',
        (SELECT MAX(id) FROM parents_children));`
      )
    );
};
