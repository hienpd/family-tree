/* eslint camelcase: "off" */

(function() {
  'use strict';

  $('#login').click(() => {
    const email = $('#login-email').val();
    const password = $('#login-password').val();

    if (!email || !email.trim()) {
      return Materialize.toast('Please enter an email.', 4000);
    }

    if (!password || !password.trim()) {
      return Materialize.toast('Please enter a password.', 4000);
    }

    $.ajax({
      method: 'POST',
      url: '/session/',
      contentType: 'application/json',
      data: JSON.stringify({ email, password })
    })
    .then(() => {
      window.location.href = '/tree';
    })
    .catch(() => {
      Materialize.toast('Unable to log in!', 4000);
    });
  });
})();
