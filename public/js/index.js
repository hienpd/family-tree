
$('#login').click((event) => {
  const email = $('#login-email').val();
  const password = $('#login-password').val();

  console.log(email, password);

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
