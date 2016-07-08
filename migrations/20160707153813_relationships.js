'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('relationships', (table) => {
    table.increments();
    table.string('parent_id')
      .defaultTo('');
    table.string('child_id')
      .defaultTo('')
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('relationships');
};
