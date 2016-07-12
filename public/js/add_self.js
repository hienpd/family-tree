'use strict';

var $xhr = $.ajax({
  method: 'GET',
  url: '/people',
  dataType: 'json'
});

$xhr.done((data) => {
  console.log(data);
  for (const person of data) {
    $('#choose-parents').append(
      $('<option></option>').val(person.id).html(`${person.given_name} ${person.family_name}`));
  }
});

$xhr.fail((err) => {
  console.log(err);
});

$('#logout').click((event) => {
  var $xhr = $.ajax({
    method: 'DELETE',
    url: '/session'
  });

  $xhr.done(function() {
    window.location.href = '/';
  });

  $xhr.fail(function(err) {
    Materialize.toast('Unable to log out!', 4000);
    console.err(err);
  });
});

$(document).ready(function(){
    $('.modal-trigger').leanModal();
});

$('.datepicker').pickadate({
  selectMonths: true, // Creates a dropdown to control month
  selectYears: 150 // Creates a dropdown of 15 years to control year
});
$(document).ready(function() {
  $('select').material_select();
});
