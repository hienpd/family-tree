/* eslint camelcase: "off" */

(function() {
  'use strict';

  $('#logout').click(() => {
    $.ajax({
      method: 'DELETE',
      url: '/session'
    })
    .then(() => {
      window.location.href = '/';
    })
    .catch(() => {
      Materialize.toast('Unable to log out!', 4000);
    });
  });

  $(document).ready(() => {
    $('.modal-trigger').leanModal();
  });

  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 150 // Creates a dropdown of 15 years to control year
  });
  $(document).ready(() => {
    $('select').material_select();
  });
})();
