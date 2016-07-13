'use strict';

const $xhr = $.ajax({
  method: 'GET',
  url: '/people'
});

$xhr.done(function(data) {
  for (const person of data) {
    const name = `${person.given_name} ${person.middle_name} ${person.family_name}`;
    $('#list').append($(`<li data-id="${person.id}">${name}</li>`));
  }

  $('#list').on('click', 'li', (event) => {
    const id = $(event.target).attr('data-id');
    $('.modal-content').append($(`<h4>ID = ${id}</h4>`))
    $('#modal1').openModal();
  })

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
