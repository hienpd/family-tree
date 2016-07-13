'use strict';

const express = require('express');
const router = express.Router();
const rp = require('request-promise');

router.post('/email', (req, res, next) => {
  var options = {
      method: 'POST',
      uri: 'https://api.postmarkapp.com/email',
      body: {
          From: 'baobab@kenmcgrady.com',
          To: req.body.email,
          Cc: 'thatmichaelpark@gmail.com',
          Subject: 'You\'ve been invited to Baobab!',
          TextBody: 'Dude. Plz reply.'
      },
      headers: {
        'X-Postmark-Server-Token': '76b40eca-7358-459b-8658-217bad4f9eb4'

      },
      json: true // Automatically stringifies the body to JSON
  };

  rp(options)
      .then(function (parsedBody) {
          res.sendStatus(200);
      })
      .catch(function (err) {
          next(err);
      });
    });

module.exports = router;

/*
method: 'POST',
url: 'https://api.postmarkapp.com/email',
dataType: 'application/json',
contentType: 'application/json',
headers: {
  'X-Postmark-Account-Token': '610e7308-e078-4498-ae1a-a79d7a9dfbf2'
  // 'X-Postmark-Server-Token': '76b40eca-7358-459b-8658-217bad4f9eb4'
},
data: {
}


*/
