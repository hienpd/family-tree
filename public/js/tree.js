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
        const twoDigit = function (d) {
          return ('0' + d).slice(-2);
        }
        const date = new Date(person.dob);
        dob = date.getFullYear() + '-' + twoDigit(date.getMonth() + 1) + '-' + twoDigit(date.getDate());
      }
      $('.modal-content').empty();
      $('.modal-content').append($(
        `
        <div class="row">
          <div class="input-field col s4">
            <input value="${person.given_name}" id="edit_given_name" type="text" class="validate">
            <label class="active" for="edit_given_name">Given Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s4">
            <input value="${person.middle_name}" id="edit_middle_name" type="text" class="validate">
            <label class="active" for="edit_middle_name">Middle Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s4">
            <input value="${person.family_name}" id="edit_family_name" type="text" class="validate">
            <label class="active" for="edit_family_name">Family Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s6">
            <input type="date" value="${dob}" class="datepicker" id="edit_dob">
            <label for="edit_dob" class="active">Date of Birth</label>
          </div>
          <div class="input-field col s6">
            <select id="edit_gender">
              <option value="" disabled selected>Gender</option>
              <option value="f">Female</option>
              <option value="m">Male</option>
              <option value="a">Agender</option>
              <option value="i">Intersex</option>
              <option value="p">Pangender</option>
              <option value="t">Transgender/Transsexual</option>
              <option value="s">Two-Spirit</option>
            </select>
            <label>Gender</label>
        </div>

              `
      ));

      $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 150, // Creates a dropdown of 15 years to control year
        format: 'yyyy-mm-dd'
      });
      $(`#edit_gender option[value=${person.gender}]`).prop('selected', true);
      Materialize.updateTextFields();
      $('select').material_select();

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
