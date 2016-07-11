
$('#login').click((event) => {
  const email = $('#login-email').val();
  const password = $('#login-password').val();

  console.log(email, password);
  
  var $xhr = $.ajax({
    method: 'POST',
    url: '/session/',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({email: email, password: password})
  });

});
