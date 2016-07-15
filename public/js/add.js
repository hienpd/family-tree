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
          <a id="send" class="waves-effect waves-light btn-large">Send invitation</a>
        </div>
      </div>
    </div>
  </div>
`;
  $('#email-div').empty().append($(card));

  $('#send').click((event) => {
    const email = $('#invite-email').val();
    if (email.length === 0) {
      Materialize.toast('Please enter email', 4000);
      return;
    }

    $.ajax({
      method: 'POST',
      url: '/email',
      contentType: 'application/json',
      data: JSON.stringify({
        email: email
      })
    })
    .then((data) => {
      Materialize.toast('Invitation sent!', 4000);
    })
    .catch((err) => {
      Materialize.toast('Email failed', 4000);
      console.log(err);
    })
  });

}


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
  $('select').material_select();
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
    gender
  };

  if (isSelf) {
    stuff.user_id = userId;
  }

  if (dob !== '') {
    stuff.dob = dob;
  }

  $.ajax({
    method: 'POST',
    url: '/people',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(stuff)
  })
  .then((data) => {
    const childId = data.id;

    const sendToTable = choose_parents.map((parent) => {
      return {
        parent_id: parent,
        child_id: childId
      };
    });

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
  .catch((err) => {
    Materialize.toast('Unable to save!', 4000);
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

// $(document).ready(function() {
//   $('select').material_select();
// });
