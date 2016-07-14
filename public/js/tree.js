'use strict';

const popUpEditModal = function(event) {

  const id = $(event.target).attr('data-id');

  $.ajax({
    method: 'GET',
    url: '/people/' + id
  })
  .then((data) => {
    person = data;
    let dob = '';
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
      </div>
      <div class="row">
        <div class="input-field col s12">
          <select id="choose-parents" multiple>
            <option value="" disabled selected>Choose your parents</option>
          </select>
          <label>Choose Parents</label>
        </div>
      </div>
      <div class="row">
        <a id="save" class="waves-effect waves-light btn-large">Save</a>
      </div>
      <div class="row">
      <div class="col s12 m6">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title">Invite to Baobab</span>
            <div class="row">
              <div class="input-field col s12">
                <input id="invite-email" type="email" class="validate">
                <label for="invite-email">Email</label>
              </div>
            </div>
          </div>
          <div class="card-action">
            <a id="send" class="waves-effect waves-light btn-large">Send invitation</a>
          </div>
        </div>
      </div>
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

      const $xhr2 = $.ajax({
        method: 'GET',
        url: `/people/${person.id}/parents`
      })

      $xhr2.done((parents) => {

        for (const parent of parents) {
          $(`#choose-parents option[value=${parent.parent_id}]`).prop('selected', true);
        }

        $('select').material_select();
        $('#modal1').openModal();

        $('#send').click((event) => {
          const email = $('#invite-email').val();
          if (email.length === 0) {
            Materialize.toast('Please enter email', 4000);
            return;
          }

          const $email_xhr = $.ajax({
            method: 'POST',
            url: '/email',
            contentType: 'application/json',
            data: JSON.stringify({
              email: email
            })
          });

          $email_xhr.done((data) => {
            Materialize.toast('Invitation sent!', 4000);
          });

          $email_xhr.fail((err) => {
            Materialize.toast('Email failed', 4000);
            console.log(err);
          })
        });

        $('#save').click((event) => {
          if ($('#choose-parents').val().length > 2) {
            return Materialize.toast('Maximum number of parents is two!', 4000);
          }
          const stuff = {
            given_name: $('#edit_given_name').val(),
            middle_name: $('#edit_middle_name').val(),
            family_name: $('#edit_family_name').val(),
            gender: $('#edit_gender').val()
          };
          if ($('#edit_dob').val()) {
            stuff.dob = $('#edit_dob').val();
          }

          $.ajax({
            method: 'PATCH',
            url: '/people/' + person.id,
            contentType: 'application/json',
            data: JSON.stringify(stuff)
          })
          .then((data) => {

            return $.ajax({
              method: 'PATCH',
              url: '/parents_children/' + person.id,
              contentType: 'application/json',
              data: JSON.stringify($('#choose-parents').val().map((parent) => {
                return {
                  parent_id: parent,
                  child_id: person.id
                };
              }))
            });
          })
          .then((data) => {
            $('#modal1').closeModal();
          })
          .catch((err) => {
            Materialize.toast('Unable to save', 4000);
            console.log(err);
          })
        })
      });

      $xhr2.fail((err) => {
        Materialize.toast('Failed getting parents', 4000);
      })
    });

    $xhr.fail((err) => {
      console.log(err);
    });


  })
  .catch((err) => {
    Materialize.toast('Unable to edit', 4000);
  });
}


const $xhr = $.ajax({
  method: 'GET',
  url: '/people'
});

let person;


$xhr.done(function(data) {
  for (const person of data) {
    const name = `${person.given_name} ${person.middle_name} ${person.family_name}`;
    $('#list').append($(`<li>${name} <a data-id="${person.id}">Edit</a></li>`));
  }

  $('#list').on('click', 'a', popUpEditModal);
});

$xhr.fail(function(err) {
  Materialize.toast('fail!', 4000);
  console.err(err);
});



$('#logout').click((event) => {
  var $xhr = $.ajax({
    method: 'DELETE',
    url: '/session'
  })
  .then(function() {
    window.location.href = '/';
  })
  .catch(function(err) {
    Materialize.toast('Unable to log out!', 4000);
    console.err(err);
  });
});
