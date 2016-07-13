'use strict';

// Populate dropdown menu
var $xhr = $.ajax({
  method: 'GET',
  url: '/people',
  dataType: 'json'
});

$xhr.done((data) => {
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

  if (!given_name || !given_name.trim()) {
    return Materialize.toast('Please enter a given name AKA first name!', 4000);
  }

  if (!family_name || !family_name.trim()) {
    return Materialize.toast('Please enter a family name AKA last name!', 4000);
  }

  if (choose_parents.length > 2) {
    return Materialize.toast('Maximum number of parents is two!', 4000);
  }

  const userId = Number.parseInt(/family-tree-userId=(\d+)/.exec(document.cookie)[1]);
  const stuff = {
    given_name,
    middle_name,
    family_name,
    gender,
    user_id: userId
  };
  if (dob !== '') {
    stuff.dob = dob;
  }
  const $xhr = $.ajax({
    method: 'POST',
    url: '/people',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(stuff)
  });


  $xhr.done((data) => {
    const childId = data.id;

    const sendToTable = choose_parents.map((parent) => {
      return {
        parent_id: parent,
        child_id: childId
      };
    });

    const $xhr = $.ajax({
      method: 'POST',
      url: '/parents_children',
      contentType: 'application/json',
      data: JSON.stringify(sendToTable)
    });

    $xhr.done((data) => {
      window.location.href = 'tree';
    });

    $xhr.fail((err) => {
      Materialize.toast('Add failed!', 4000);
      console.log(err);
    });
  });

  $xhr.fail((err) => {
    Materialize.toast('POST to people table failed!', 4000);
    console.log(err);
  });
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

$(document).ready(function() {
  $('.modal-trigger').leanModal();
});

$('.datepicker').pickadate({
  selectMonths: true, // Creates a dropdown to control month
  selectYears: 150, // Creates a dropdown of 15 years to control year
  format: 'yyyy-mm-dd'
});

$(document).ready(function() {
  $('select').material_select();
});
