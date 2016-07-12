'use strict';

$('#login').click((event) => {
  const email = $('#login-email').val();
  const password = $('#login-password').val();

  if (!email || !email.trim()) {
    return Materialize.toast('Please enter an email.', 4000);
  }

  if (!password || !password.trim()) {
    return Materialize.toast('Please enter a password.', 4000);
  }

  var $xhr = $.ajax({
    method: 'POST',
    url: '/session/',
    contentType: 'application/json',
    data: JSON.stringify({email: email, password: password})
  });

  $xhr.done(function(data) {
    window.location.href = '/tree';
  });

  $xhr.fail(function(err) {
    Materialize.toast('Unable to log in!', 4000);
  });

});
