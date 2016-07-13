'use strict';

const $xhr = $.ajax({
  method: 'GET',
  url: '/people'
});

$xhr.done(function(data) {
  for (const person of data) {
    const name = `${person.given_name} ${person.middle_name} ${person.family_name}`;
    $('#list').append($(`<li>${name} <a data-id="${person.id}">Edit</a></li>`));
  }

  $('#list').on('click', 'a', (event) => {
    const id = $(event.target).attr('data-id');
    const $xhr = $.ajax({
      method: 'GET',
      url: '/people/' + id
    });

    $xhr.done((person) => {
      let dob = 'n/a';
      if (person.dob) {
        const date = new Date(person.dob);
        dob = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      }
      $('.modal-content').empty();
      $('.modal-content').append($(
        `<p>${person.given_name} ${person.middle_name} ${person.family_name}</p>
        <p>${dob}</p>
        <p>${person.gender}</p>
        `
      ));
      $('#modal1').openModal();

    });

    $xhr.fail((err) => {
      Materialize.toast('Unable to edit', 4000);
    });
  });

});

$xhr.fail(function(err) {
  Materialize.toast('fail!', 4000);
  console.err(err);
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
