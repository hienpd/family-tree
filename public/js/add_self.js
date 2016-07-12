'use strict';

// Populate dropdown menu
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

// Event handler for save button
$('#save').click((event) => {
  const given_name = $('#given-name').val();
  const middle_name = $('#middle-name').val();
  const family_name = $('#family-name').val();
  const dob = $('#dob').val();
  const gender = $('#gender').val();
  const choose_parents = $('#choose-parents').val();

console.log(given_name);

  if (!given_name || !given_name.trim()) {
    return   Materialize.toast('Please enter a given name AKA first name!', 4000);
  }

  if (!family_name || !family_name.trim()) {
    return   Materialize.toast('Please enter a family name AKA last name!', 4000);
  }

  if (!dob || !dob.trim()) {
    return   Materialize.toast('Please enter a date of birth!', 4000);
  }

  if (choose_parents.length > 2) {
    return   Materialize.toast('Maximum number of parents is two!', 4000);
  }

});


// Logout
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
