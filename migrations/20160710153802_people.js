'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('people', (table) => {
    table.increments();
    table.string('given_name')
      .notNullable()
      .defaultTo('');
    table.string('middle_name')
      .defaultTo('');
    table.string('family_name')
      .notNullable()
      .defaultTo('');
    table.date('dob');
    table.string('gender');
    table.timestamps(true, true);
    table.integer('user_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('people');
};
