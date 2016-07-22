/* eslint camelcase: "off" */
/* global isSelf:false */

(function() {
  'use strict';

  if (!isSelf) {
    const card = `
    <div class="row">
      <div class="col s6">
        <div class="card">
          <div class="card-content green-text">
            <p class="card-title">Invite Family Member to Baobab!</p>
            <div class="row">
              <div class="input-field col s12">
                <input id="invite-email" type="email" class="validate">
                <label for="invite-email">Email</label>
              </div>
            </div>
          </div>
          <div class="card-action">
            <a id="send" class="waves-effect waves-light btn-large">
            Send invitation</a>
          </div>
        </div>
      </div>
    </div>
  `;

    $('#email-div').empty().append($(card));

    $('#send').click(() => {
      const email = $('#invite-email').val();

      if (email.length === 0) {
        Materialize.toast('Please enter email', 4000);

        return;
      }

      $.ajax({
        method: 'POST',
        url: '/email',
        contentType: 'application/json',
        data: JSON.stringify({ email })
      })
      .then(() => {
        Materialize.toast('Invitation sent!', 4000);
      })
      .catch(() => {
        Materialize.toast('Email failed', 4000);
      });
    });
  }

  // Populate dropdown menu
  $.ajax({
    method: 'GET',
    url: '/people',
    dataType: 'json'
  })
  .then((data) => {
    for (const person of data) {
      $('#choose-parents').append(
        $('<option></option>').val(person.id).html(`${person.given_name}
           ${person.family_name}`));
    }
    $('select').material_select();
  })
  .catch((err) => {
    Materialize.toast(`Fail! ${err}`, 4000);
  });

  // Event handler for save button
  $('#save').click(() => {
    const given_name = $('#given-name').val();
    const middle_name = $('#middle-name').val();
    const family_name = $('#family-name').val();
    const dob = $('#dob').val();
    const gender = $('#gender').val();
    const choose_parents = $('#choose-parents').val();

    (function validation() {
      if (!given_name || !given_name.trim()) {
        return Materialize.toast(
          'Please enter a given name AKA first name!', 4000);
      }

      if (!family_name || !family_name.trim()) {
        return Materialize.toast(
          'Please enter a family name AKA last name!', 4000);
      }

      if (choose_parents.length > 2) {
        return Materialize.toast('Maximum number of parents is two!', 4000);
      }
    })();

    const person_info = {
      given_name,
      middle_name,
      family_name,
      gender
    };

    const regexResult = /family-tree-userId=(\d+)/.exec(document.cookie);

    if (regexResult === null) {
      return Materialize.toast('Cookie not found', 4000);
    }

    const userId = Number.parseInt(regexResult[1]);

    if (isSelf) {
      person_info.user_id = userId;
    }

    if (dob !== '') {
      person_info.dob = dob;
    }

    $.ajax({
      method: 'POST',
      url: '/people',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(person_info)
    })
    .then((data) => {
      const childId = data.id;

      const sendToTable = choose_parents.map((parent) => ({
        parent_id: parent,
        child_id: childId
      }));

      return $.ajax({
        method: 'POST',
        url: '/parents_children',
        contentType: 'application/json',
        data: JSON.stringify(sendToTable)
      });
    })
    .then(() => {
      window.location.href = 'tree';
    })
    .catch(() => {
      Materialize.toast('Unable to save!', 4000);
    });
  });

  // Logout
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
    selectYears: 150, // Creates a dropdown of 15 years to control year
    format: 'yyyy-mm-dd'
  });
})();
