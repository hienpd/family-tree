/* global popUpEditModal:false */

(function() {
  'use strict';

  const canvas = $('#canvas')[0];
  const ctx = canvas.getContext('2d');
  const gridSquareWidth = 120;
  const gridSquareHeight = 150;

  let persons;
  let parentRels;

  // Forward function declarations
  let initData; // eslint-disable-line prefer-const
  let drawTree; // eslint-disable-line prefer-const

  const loadTreePage = function() {
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
      parentRels = data;
    })
    .then(() => {
      initData();
      drawTree();
    })
    .catch(() => {
      Materialize.toast('Error loading tree data', 4000);
    });
  };

  loadTreePage();

  let personsById;
  let materix;

  initData = function() {
    personsById = [];
    for (const person of persons) {
      personsById[person.id] = person;
    }

    // init materix
    materix = [];
    for (let i = 0; i < 30; ++i) { // some # > max id
      materix.push([]);
    }

    for (const pr of parentRels) {
      for (const qr of parentRels) {
        if (pr.child_id === qr.child_id) {
          materix[pr.parent_id][qr.parent_id] = true;
          materix[qr.parent_id][pr.parent_id] = true;
        }
      }
    }
  };

  const matesOf = function(id) {
    id = Number(id);
    const res = [];

    for (let j = 0; j < 30; ++j) {
      if (materix[id][j]) {
        res.push(j);
      }
    }

    return res;
  };

  const parentsOf = function(id) {
    id = Number(id);
    const res = [];

    for (const pr of parentRels) {
      if (pr.child_id === id) {
        res.push(pr.parent_id);
      }
    }

    return res;
  };

  const childrenOf = function(id1, id2) {
    id1 = Number(id1);
    id2 = Number(id2);
    const res = [];

    for (const person of persons) {
      const ps = parentsOf(person.id);

      if (ps.indexOf(id1) >= 0 && ps.indexOf(id2) >= 0) {
        res.push(person.id);
      }
    }

    return res;
  };

  let topId;
  let topHeight; // set to 0 before calling findTop *cough* *HACK* *cough*

  const findTop = function(height, id) {
    if (height >= topHeight) {
      topHeight = height;
      topId = id;
    }
    const parents = parentsOf(id);

    for (const parent of parents) {
      findTop(height + 1, parent);
    }

    return topId;
  };

  const descend = function(generation) {
    for (let i = 0; i < generation.length; ++i) {
      const ms = matesOf(generation[i].id);

      switch (ms.length) {
        case 0:
          break;
        case 1:
          generation[i].rightId = null;
          generation[i].children =
            childrenOf(generation[i].id, generation[i].id);
          generation[i].children =
            descend(generation[i].children.map((x) => ({ id: x })));
          break;
        case 2:
          ms.splice(ms.indexOf(generation[i].id), 1);
          generation[i].rightId = ms[0];
          generation[i].children =
            childrenOf(generation[i].id, generation[i].rightId);
          generation[i].children =
            descend(generation[i].children.map((x) => ({ id: x })));
          break;
        case 3:
          ms.splice(ms.indexOf(generation[i].id), 1);
          generation[i].leftId = ms[0];
          generation[i].rightId = ms[1];
          generation[i].leftChildren =
            childrenOf(generation[i].id, generation[i].leftId);
          generation[i].rightChildren =
            childrenOf(generation[i].id, generation[i].rightId);
          generation[i].leftChildren =
            descend(generation[i].leftChildren.map((x) => ({ id: x })));
          generation[i].rightChildren =
            descend(generation[i].rightChildren.map((x) => ({ id: x })));
          break;
        default:
      }
    }

    return generation;
  };

  const computeWidth = function(children) {
    let width = 0;

    for (const child of children) {
      if (child.rightId === undefined) { // no mates => no children
        child.width = 1;
        width += child.width;
      }
      else if (child.leftId === undefined) { // one mate (on right)
        child.width = Math.max(2, computeWidth(child.children));
        width += child.width;
      }
      else {  // two mates
        child.leftWidth = Math.max(2, computeWidth(child.leftChildren));
        child.rightWidth = Math.max(2, computeWidth(child.rightChildren));
        width += child.leftWidth + child.rightWidth;
      }
    }
    children.width = width;

    return width;
  };

  let maxLevel = 0;

  // eslint-disable-next-line max-params
  const drawNode = function(name, id, selectedId, x, y) {
    const $node = $(`
      <div class="node">
      ${name}
      <a class="edit btn-floating yellow" data-id="${id}">
      <i class="tiny material-icons">mode_edit</i>
      </a>
      </div>`
    );

    if (id === selectedId) {
      $node.addClass('selected');
    }
    $('.tree-div').append(
      $node.css({
        left: (x + 1) * gridSquareWidth - 50,
        top: (y + 0) * gridSquareHeight - 50
      })
    );
  };

  const drawLine = function(coords) {
    ctx.beginPath();
    ctx.strokeStyle = '#fb4d3d';
    ctx.lineWidth = 6;
    ctx.moveTo((coords[0] + 1) * gridSquareWidth,
               (coords[1] + 0) * gridSquareHeight);
    coords.splice(0, 2);
    while (coords.length) {
      ctx.lineTo((coords[0] + 1) * gridSquareWidth,
                 (coords[1] + 0) * gridSquareHeight);
      coords.splice(0, 2);
    }
    ctx.stroke();
    ctx.closePath();
  };

  // eslint-disable-next-line max-params
  const drawJoin = function(parentx, parenty, x, y) {
    if (parentx === undefined) {
      return;
    }
    const midy = (parenty + y) / 2;

    drawLine([parentx, parenty, parentx, midy, x, midy, x, y]);
  };

  let selectedPersonId;
  const drawnIds = [];

  // eslint-disable-next-line max-params
  const drawSubtree = function(tree, left, level, parentx, parenty, parentw) {
    if (level > maxLevel) {
      maxLevel = level;
    }

    let actualw = 0;

    (function computeActualWidth() {
      for (const node of tree) {
        if (node.rightId === undefined) { // single node
          actualw += 1;
        }
        else if (node.leftId === undefined) { // double node (one mate)
          actualw += 2;
        }
        else { // triple node (two mates)
          actualw += (node.leftWidth + node.rightWidth) / 2 + 1;
        }
      }
    })();

    const offset = (parentw - actualw) / 2;

    const singleNode = function(node, person) {
      drawJoin(parentx, parenty, left + offset, level);
      drawNode(`${person.given_name} ${person.family_name}`, person.id,
        selectedPersonId, left + offset, level
      );
      drawnIds.push(person.id);
      left += node.width;
    };

    const doubleNode = function(node, person) {
      drawJoin(parentx, parenty, left + offset, level);
      drawLine([left + offset, level, left + offset + 1, level]);
      drawNode(`${person.given_name} ${person.family_name}`, person.id,
        selectedPersonId, left + offset, level
      );
      drawnIds.push(person.id);
      const personRight = personsById[node.rightId];

      drawNode(`${personRight.given_name} ${personRight.family_name}`,
        selectedPersonId, personRight.id, left + offset + 1, level
      );
      drawnIds.push(personRight.id);
      drawSubtree(node.children, left, level + 1, left + offset + 0.5,
        level, node.width
      );
      left += node.width;
    };

    const tripleNode = function(node, person) {
      const personRight = personsById[node.rightId];
      const personLeft = personsById[node.leftId];
      const xl = (node.leftWidth - 1) / 2 + offset;
      const xr = (node.rightWidth - 1) / 2 + node.leftWidth + offset;
      const xm = (xl + xr) / 2;

      drawLine([xl - 0.5, level, xr + 0.5, level]);
      drawJoin(parentx, parenty, xm, level);
      drawNode(`${person.given_name} ${person.family_name}`, person.id,
        selectedPersonId, xm, level
      );
      drawNode(`${personRight.given_name} ${personRight.family_name}`,
        personRight.id, selectedPersonId, xr + 0.5, level
      );
      drawNode(`${personLeft.given_name} ${personLeft.family_name}`,
        personLeft.id, selectedPersonId, xl - 0.5, level
      );
      (function pushIds() {
        drawnIds.push(person.id);
        drawnIds.push(person.rightId);
        drawnIds.push(person.leftId);
      })();
      drawSubtree(node.leftChildren, left + offset, level + 1, xl, level,
        node.leftWidth
      );
      left += node.leftWidth;
      drawSubtree(node.rightChildren, left + offset, level + 1, xr, level,
        node.rightWidth
      );
      left += node.rightWidth;
    };

    for (const node of tree) {
      const person = personsById[node.id];

      if (node.rightId === undefined) { // single node
        singleNode(node, person);
      }
      else if (node.leftId === undefined) { // double node (one mate)
        doubleNode(node, person);
      }
      else { // triple node (two mates)
        tripleNode(node, person);
      }
    }
  };

  drawTree = function() {
    const $canvas = $('.tree-div canvas');

    $('.tree-div').empty().append($canvas);

    ctx.clearRect(0, -10, canvas.width, canvas.height); // origin is 10px down

    const userId =
      Number.parseInt(/family-tree-userId=(\d+)/.exec(document.cookie)[1]);

    for (const person of persons) {
      if (person.user_id === userId) {
        selectedPersonId = person.id;
        break;
      }
    }

    topHeight = 0;
    const top = [{ id: findTop(0, selectedPersonId) }];

    descend(top);
    computeWidth(top);

    drawSubtree(top, (11 - top.width) / 2, 0, undefined, undefined, top.width);

    (function drawUnconnectedNodes() {
      let x = 0;
      const y = maxLevel + 1;

      for (const person of persons) {
        if (drawnIds.indexOf(person.id) >= 0) {
          continue;
        }
        drawNode(`${person.given_name} ${person.family_name}`,
          person.id, selectedPersonId, x, y);
        x += 1;
      }
    })();
  };

  canvas.width = 1440;
  canvas.height = 550;
  ctx.translate(0, 10);

  $('.tree-div').on('click', 'a.edit', popUpEditModal);
})();
