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

    const $xhr = $.ajax({
      method: 'POST',
      url: '/session/',
      contentType: 'application/json',
      data: JSON.stringify({ email, password })
    });

    $xhr.done(() => {
      window.location.href = '/tree';
    });

    $xhr.fail(() => {
      Materialize.toast('Unable to log in!', 4000);
    });
  });
})();
