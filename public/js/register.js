'use strict';

$('#register').click((event) => {
  const email = $('#email').val();
  const password = $('#password').val();
  const confirm_password = $('#confirm-password').val();

  var $xhr = $.ajax({
    method: 'POST',
    url: '/users',
    contentType: 'application/json',
    data: JSON.stringify({email: email, password: password})
  });

  $xhr.done((data) => {
    console.log(data);
  });

  $xhr.fail((err) => {
    console.log(err);
  });

});

$('.datepicker').pickadate({
  selectMonths: true, // Creates a dropdown to control month
  selectYears: 150 // Creates a dropdown of 15 years to control year
});
$(document).ready(function() {
  $('select').material_select();
});
