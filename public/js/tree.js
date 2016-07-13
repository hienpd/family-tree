'use strict';

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

  $('#list').on('click', 'a', (event) => {
    const id = $(event.target).attr('data-id');
    const $xhr = $.ajax({
      method: 'GET',
      url: '/people/' + id
    });

    $xhr.done((data) => {
      person = data;
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

          $('#save').click((event) => {
            if ($('#choose-parents').val().length > 2) {
              return Materialize.toast('Maximum number of parents is two!', 4000);
            }
            const stuff = {
              given_name: $('#edit_given_name').val(),
              middle_name: $('#edit_middle_name').val(),
              family_name: $('#edit_family_name').val(),
              dob: $('#edit_dob').val(),
              gender: $('#edit_gender').val()
            };
            const $xhr3 = $.ajax({
              method: 'PATCH',
              url: '/people/' + person.id,
              contentType: 'application/json',
              data: JSON.stringify(stuff)
            });

            $xhr3.done((data) => {

              const $xhr4 = $.ajax({
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

              $xhr4.done((data) => {
                $('#modal1').closeModal();
              });

              $xhr4.fail((err) => {
                Materialize.toast('Parents update failed', 4000);
                console.log(err);
              })
            });

            $xhr3.fail((err) => {
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
