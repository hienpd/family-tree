'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/family_tree_dev'
  },

  test: {
      client: 'pg',
      connection: 'postgres://localhost/family_tree_test'
  }
};
