const canvas = $('#canvas')[0];
const ctx = canvas.getContext('2d');
const g_w = 120;
const g_h = 150;

let persons;
let parent_rels;

const loadTreePage = function () {

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

loadTreePage();

let personsById;
let materix;

function initData(persons, parent_rels) {
  personsById = [];
  for (const person of persons) {
    personsById[person.id] = person;
  }

  // init materix
  materix = [];
  for (let i=0; i<30; ++i) { // some # > max id
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
  for (let j=0; j<30; ++j) {
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
let depth; // set to 0 before calling findTop *cough* *HACK* *cough*
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

function computeWidth(children) {
  let width = 0;
  for (const child of children) {
    if (child.r_id === undefined) { // no mates => no children
      child.width = 1;
      width += child.width;
    } else if (child.l_id === undefined) { // one mate (on right)
      child.width = Math.max(2, computeWidth(child.children));
      width += child.width;
    } else {  // two mates
      child.l_width = Math.max(2, computeWidth(child.l_children));
      child.r_width = Math.max(2, computeWidth(child.r_children));
      width += child.l_width + child.r_width;
    }
  }
  children.width = width;
  return width;
}

function drawTree() {

  const $canvas = $('.tree-div canvas');
  $('.tree-div').empty().append($canvas);

  ctx.clearRect(0, -10, canvas.width, canvas.height); // origin is 10px down

  let selectedPersonId;

  const userId = Number.parseInt(/family-tree-userId=(\d+)/.exec(document.cookie)[1]);
  for (const person of persons) {
    if (person.user_id === userId) {
      selectedPersonId = person.id;
      break;
    }
  }

  depth = 0;
  const topId = findTop(0, selectedPersonId);

  const t = [{id: topId}];
  descend(t);
  computeWidth(t);
  let maxLevel = 0;
  const drawnIds = [];
  drawSubtree(t, (11 - t.width) / 2, 0, undefined, undefined, t.width);

  let x = 0;
  let y = maxLevel + 1;
  for (const p of persons) {
    if (drawnIds.indexOf(p.id) >= 0) {
      continue;
    }
    drawNode(`${p.given_name} ${p.family_name}`, p.id, selectedPersonId, x++, y);
  }


  function drawSubtree(t, left, level, parentx, parenty, parentw) {
    if (level > maxLevel) {
      maxLevel = level;
    }

    let actualw = 0;
    for (const n of t) {
      if (n.r_id === undefined) { // single node
        actualw += 1;
      } else if (n.l_id === undefined) { // double node (one mate)
        actualw += 2;
      } else { // triple node (two mates)
        actualw += (n.l_width + n.r_width) / 2 + 1;
      }
    }
    const offset = (parentw - actualw) / 2;
    for (const n of t) {
      const p = personsById[n.id];
      if (n.r_id === undefined) { // single node
        drawJoin(parentx, parenty, left + offset, level);
        drawNode(p.given_name + ' ' + p.family_name, p.id, selectedPersonId, left + offset, level);
        drawnIds.push(p.id);
        left += n.width;
      } else if (n.l_id === undefined) { // double node (one mate)
        drawJoin(parentx, parenty, left + offset, level);
        drawLine([left+offset, level, left+offset+1, level]);
        drawNode(p.given_name + ' ' + p.family_name, p.id, selectedPersonId, left + offset, level);
        drawnIds.push(p.id);
        const p_r = personsById[n.r_id];
        drawNode(p_r.given_name + ' ' + p_r.family_name, selectedPersonId, p_r.id, left + offset + 1, level);
        drawnIds.push(p_r.id);
        drawSubtree(n.children, left, level + 1, left + offset + 0.5, level, n.width);
        left += n.width;
      } else { // triple node (two mates)
        const p_r = personsById[n.r_id];
        const p_l = personsById[n.l_id];
        const xl = (n.l_width - 1) / 2 + offset;
        const xr = (n.r_width - 1) / 2 + n.l_width + offset;
        const xm = (xl + xr) / 2;
        drawLine([xl - 0.5, level, xr + 0.5, level]);
        drawJoin(parentx, parenty, xm, level);
        drawNode(p.given_name + ' ' + p.family_name, p.id, selectedPersonId, xm, level);
        drawNode(p_r.given_name + ' ' + p_r.family_name, p_r.id, selectedPersonId, xr + 0.5, level);
        drawNode(p_l.given_name + ' ' + p_l.family_name, p_l.id, selectedPersonId, xl - 0.5, level);
        drawnIds.push(p.id);
        drawnIds.push(p.r_id);
        drawnIds.push(p.l_id);
        drawSubtree(n.l_children, left + offset, level + 1, xl, level, n.l_width);
        left += n.l_width;
        drawSubtree(n.r_children, left + offset, level + 1, xr, level, n.r_width);
        left += n.r_width;
      }
    }
  }
}

function drawJoin(parentx, parenty, x, y) {
  if (parentx === undefined) {
    return;
  }
  const midy = (parenty + y) / 2;
  drawLine([parentx, parenty, parentx, midy, x, midy, x, y]);
}


canvas.width = 1440;
canvas.height = 550;
ctx.translate(0, 10);

$('.tree-div').on('click', 'a.edit', popUpEditModal);

function drawNode(name, id, selectedPersonId, x, y) {
  const $node = $(`<div class="node">${name}<a class="edit btn-floating yellow" data-id="${id}"><i class="tiny material-icons">mode_edit</i></a></div>`);
  if (id === selectedPersonId) {
    $node.addClass('selected');
  }
  $('.tree-div').append($node.css({left: (x + 1) * g_w - 50, top: (y + 0) * g_h - 50}));
}

function drawLine(a) {
  ctx.beginPath();
  ctx.strokeStyle = '#fb4d3d';
  ctx.lineWidth = 6;
  ctx.moveTo((a[0] + 1) * g_w, (a[1] + 0) * g_h);
  a.splice(0, 2);
  while (a.length) {
    ctx.lineTo((a[0] + 1) * g_w, (a[1] + 0) * g_h);
    a.splice(0, 2);
  }
  ctx.stroke();
  ctx.closePath();
}
