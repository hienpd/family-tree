'use strict';

const express = require('express');
const router = express.Router();  // eslint-disable-line new-cap
const rp = require('request-promise');

router.post('/email', (req, res, next) => {
  const options = {
    method: 'POST',
    uri: 'https://api.postmarkapp.com/email',
    body: {
      From: 'baobab@kenmcgrady.com',
      To: req.body.email,
      Subject: 'You\'ve been invited to Baobab!',
      TextBody: 'Dude. Plz reply.'
    },
    headers: {
      'X-Postmark-Server-Token': process.env.POSTMARK_TOKEN

    },
    json: true // Automatically stringifies the body to JSON
  };

  rp(options)
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
