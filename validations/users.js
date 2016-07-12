'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    email: Joi.string()
      .trim()
      .email()
      .label('Email')
      .max(255)
      .required(),
    password: Joi.string()
      .trim()
      .label('Password')
      .max(255)
      .required()
      .strip()
  }
};
