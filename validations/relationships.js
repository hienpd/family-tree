'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    parent_id: Joi.number()
      .integer()
      .required()
      .label('Parent ID'),
    child_id: Joi.number()
      .integer()
      .required()
      .label('Child ID')
  }
};
