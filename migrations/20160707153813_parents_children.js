'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('parents_children', (table) => {
    table.increments();
    table.integer('parent_id')
      .references('people.id')
      .onDelete('cascade')
      .index();
    table.integer('child_id')
      .references('people.id')
      .onDelete('cascade')
      .index();
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('parents_children');
};
