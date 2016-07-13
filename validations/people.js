'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    given_name: Joi.string()
      .label('Given name AKA first name')
      .max(255)
      .required()
      .trim(),
    middle_name: Joi.string()
      .label('Middle name, goes between given name and family name')
      .allow('')
      .max(255)
      .trim(),
    family_name: Joi.string()
      .label('Family name AKA last name')
      .max(255)
      .required()
      .trim(),
    dob: Joi.date()
      .format('YYYY-MM-DD')
      .label('Date of birth in YYYY-MM-DD'),
    gender: Joi.string()
      .allow(null)
      .max(1)
      .label('Gender'),
    user_id: Joi.number()
      .integer()
  }
};
