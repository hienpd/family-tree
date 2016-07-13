'use strict';

const $xhr = $.ajax({
  method: 'GET',
  url: '/people'
});

$xhr.done(function(data) {
  Materialize.toast('success!', 4000);
  for (const person of data) {
    const name = `${person.id} ${person.given_name} ${person.middle_name} ${person.family_name}`;
    $('#list').append($(`<li><a class="waves-effect waves-light btn modal-trigger" href="#modal1">${name}</a></li>`));
  }

  $('#list').on('click', 'li', (event) => {
    const id = Number.parseInt($(event.target).text());
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
