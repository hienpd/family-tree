const canvas = $('#canvas')[0];
const ctx = canvas.getContext('2d');
const g_w = 120;
const g_h = 50;
const n = 13;


let persons;
let parent_rels;

const loadPage = function () {

  $.ajax({
    method: 'GET',
    url: '/people'
  })
  .then((data) => {
    persons = data;

    return $.ajax({
      method: 'GET',
      url: '/parents_children'
    });
  })
  .then((data) => {
    parent_rels = data;
  })
  .then(() => {
    initData(persons, parent_rels);
    drawTree();
  })
  .catch((err) => {
    Materialize.toast('Error loading tree data', 4000);
    console.log(err);
  });
};

loadPage();

let personsById;
let materix;

function initData(persons, parent_rels) {
  personsById = [];
  for (const person of persons) {
    personsById[person.id] = person;
  }

  // init materix
  materix = [];
  for (let i=0; i<20; ++i) { // some # > max id
    materix.push([]);
  }

  for (const p of parent_rels) {
    const id = p.parent_id;
    for (const q of parent_rels) {
      if (p.child_id === q.child_id) {
        materix[p.parent_id][q.parent_id] = true;
        materix[q.parent_id][p.parent_id] = true;
      }
    }
  }
}

function matesOf(id) {
  id = +id;
  const res = [];
  for (let j=0; j<20; ++j) {
    if (materix[id][j]) {
      res.push(j);
    }
  }
  return res;
}

function parentsOf(id) {
  id = +id;
  const res = [];
  for (const p of parent_rels) {
    if (p.child_id === id) {
      res.push(p.parent_id);
    }
  }
  return res;
}

function childrenOf(id1, id2) {
  id1 = +id1;
  id2 = +id2;
  const res = [];
  for (const person of persons) {
    const ps = parentsOf(person.id);
    if (ps.indexOf(id1) >= 0 && ps.indexOf(id2) >= 0) {
      res.push(person.id);
    }
  }
  return res;
}

let topId;
let depth = 0;
function findTop(d, id) {
  if (d >= depth) {
    depth = d;
    topId = id;
  }
  const ps = parentsOf(id);
  for (const p of ps) {
    findTop(d+1, p);
  }
  return topId;
}

function descend(generation) {
  console.log('gen', generation);
  for (let i=0; i<generation.length; ++i) {
    const ms = matesOf(generation[i].id);
    let children;
    switch(ms.length) {
      case 0:
        break;
      case 1:
        generation[i].r_id = null;
        generation[i].children = childrenOf(generation[i].id, generation[i].id);
        generation[i].children = descend(generation[i].children.map((x) => ({id: x})));
        break;
      case 2:
        ms.splice(ms.indexOf(generation[i].id), 1);
        generation[i].r_id = ms[0];
        generation[i].children = childrenOf(generation[i].id, generation[i].r_id);
        generation[i].children = descend(generation[i].children.map((x) => ({id: x})));
        break;
      case 3:
        ms.splice(ms.indexOf(generation[i].id), 1);
        generation[i].l_id = ms[0];
        generation[i].r_id = ms[1];
        generation[i].l_children = childrenOf(generation[i].id, generation[i].l_id);
        generation[i].r_children = childrenOf(generation[i].id, generation[i].r_id);
        generation[i].l_children = descend(generation[i].l_children.map((x) => ({id: x})));
        generation[i].r_children = descend(generation[i].r_children.map((x) => ({id: x})));
        break;
    }
  }
  return generation;
}


function drawTree() {
  console.log('res', descend([{id: 2}]));
}




canvas.width = (n-0.5) * g_w;
canvas.height = (n - 0.5) * g_h;
for (let i=0; i<n; ++i) {
  ctx.moveTo(0, i*g_h);
  ctx.lineTo(n*g_w, i*g_h);
  ctx.stroke();
  ctx.moveTo(i*g_w, 0);
  ctx.lineTo(i*g_w, n*g_h);
  ctx.stroke();
}

$('.main-div').on('click', 'div.edit', (event) => {
  alert($(event.target).attr('data-id'));
})

function drawNode(name, id, x, y) {
  $('.main-div').append($(`<div class="node">${name}<div class="edit" data-id="${id}">Edit</div></div>`).css({left: x-50, top:y-50}));
}
