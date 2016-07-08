'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('people', (table) => {
    table.increments();
    table.string('first_name')
      .notNullable()
      .defaultTo('');
    table.string('middle_name')
      .defaultTo('');
    table.string('last_name')
      .notNullable()
      .defaultTo('');
    table.date('dob');
    table.string('gender')
      .notNullable()
      .defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('people');
};
