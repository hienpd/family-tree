'use strict';

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
