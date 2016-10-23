/* eslint-disable max-lines */
/* global popUpEditModal:false */
// eslint-disable-next-line max-statements
(function() {
  'use strict';

  const gridSquareWidth = 120;
  const gridSquareHeight = 150;
  const nodeRadius = 50; // Node size is 100 x 100 set in CSS
  const yOffset = 10; // Prevent line clipping against canvas

  let maxPeople;

  const canvas = $('#canvas')[0];
  const ctx = canvas.getContext('2d');

  const resize = function() {
    var div = $('.tree-div')[0];
    canvas.width = div.clientWidth;
    canvas.height = gridSquareHeight * (4 - 0.3);
    window.loadTreePage();
  };

  window.addEventListener('resize', resize);

  let persons;

  // Forward function declarations
  let initData; // eslint-disable-line prefer-const
  let drawTree; // eslint-disable-line prefer-const

  window.loadTreePage = function() {
    $.ajax({
      method: 'GET',
      url: '/people/parents'
    })
    .then((data) => {
      persons = data;
      persons.push({
        id: 0,
        given_name: '?',
        middle_name: '*',
        family_name: '!',
        parents: [null],
        user_id: null
      });
      initData();
      drawTree();
    })
    .catch((err) => {
      Materialize.toast('Error loading tree data', 4000);
      console.log('Error', err);
    });
  };

  resize();

  let personsById;
  let materix;

  initData = function() {
    let maxId = -Infinity;
    personsById = [];
    for (const person of persons) {
      personsById[person.id] = person;
      maxId = Math.max(maxId, person.id);
      if (person.parents[0] === null) {
        person.parents.length = 0;
      } else if (person.parents.length === 1) {
        person.parents.push(0); // parent id 0 => unknown
      }
    }
    maxPeople = maxId + 1;

    // init materix
    materix = Array(maxPeople).fill().map(() => []); // maxPeople x maxPeople

    // materix[a.id][b.id] => a is a mate of b (i.e. a and b
    // are parents of the same child).
    for (const person of persons) {
      if (person.parents.length === 2) {
        materix[person.parents[0]][person.parents[1]] = true;
        materix[person.parents[1]][person.parents[0]] = true;
      }
    }
  };

  const matesOf = function(id) {
    if (typeof id !== 'number') { console.log(id, 'is not a number');;; }
    // return the ids of all mates of a given id.
    id = Number(id);
    const res = [];

    for (let j = 0; j < maxPeople; ++j) {
      if (materix[id][j]) {
        res.push(j);
      }
    }

    return res;
  };

  const matesOfMatesOf = function(id) {
    // given an id, return its mates and their mates (and so on).
    // Example: a & b have a child; b & c have a child.
    // matesOf(a) = [b]
    // matesOf(b) = [a,c]
    // matesOf(c) = [b]
    // but matesOfMatesOf(a) = matesOfMatesOf(b) = matesOfMatesOf(c) = [a,b,c]
    const mates = matesOf(id);
    let changed;

    do {
      changed = false;
      for (const m of mates) {
        if (m === 0) {  // skip the unknown parent
          continue;
        }
        const mMates = matesOf(m);
        for (const mm of mMates) {
          if (mates.indexOf(mm) < 0) {
            mates.push(mm);
            changed = true;
          }
        }
      }
    } while (changed);

    return mates;
  }

  const childrenOf = function(id1, id2) {
    if (typeof id1 !== 'number') { console.log(id1, 'is not a number');;; }
    if (typeof id2 !== 'number') { console.log(id2, 'is not a number');;; }
    id1 = Number(id1);
    id2 = Number(id2);
    const res = [];

    for (const person of persons) {
      const ps = person.parents;

      if (ps.indexOf(id1) >= 0 && ps.indexOf(id2) >= 0) {
        res.push(person.id);
      }
    }

    return res;
  };

  const findTop = function(id) {
    // find top (i.e. root) of tree containing given id.
    let topId;
    let topHeight = 0;

    const findTopHelper = function(height, id) {
      if (height >= topHeight) {
        topHeight = height;
        topId = id;
      }
      const parents = personsById[id].parents;
      for (const parent of parents) {
        findTopHelper(height + 1, parent);
      }
    };

    findTopHelper(0, id);
    return topId;
  }

  class SingleNode {
    // Represents a person with no mates.
    constructor (id) {
      this.id = id;
    }
  }

  class DoubleNode {
    // Represents a person with one mate.
    constructor (id, mateId) {
      this.id = id;
      this.mateId = mateId;
      this.children = childrenOf(id, mateId).map((child) => nodify(child));
    }
  }

  class TripleNode {
    // Represents a person with two mates.
    constructor (id, ids) {
      // ids is an array of three ids, one of which is id, the other two
      // are id's mates. The position of id in the array depends on who's
      // mated with whom.
      this.id = id;
      this.ids = ids; // array of three ids, one of which is id.
      this.leftChildren = childrenOf(ids[0], ids[1]).map((child) => nodify(child));
      this.rightChildren = childrenOf(ids[1], ids[2]).map((child) => nodify(child));
    }
  }

  const nodify = function(id) {
    // Given an id, creates an appropriate TreeNode and its
    // subtrees; returns the TreeNode.
    const mates = matesOfMatesOf(id);

    if (mates.length === 0) {
      return new SingleNode(id);
    }
    else if (mates.length === 2) {
      return new DoubleNode(id, mates[0] !== id ? mates[0] : mates[1]);
    }
    else if (mates.length !== 3) {
      throw new Error('Bad number of mates!');
    }
    // If mates.length = 3, things get interesting.
    // We expect (and can handle) only this situation: two of the mates
    // have one mate each and the third has two mates. E.g.
    // matesOf(a) = b, c
    // matesOf(b) = a
    // matesOf(c) = a
    // We want the one with two mates to be in the middle: [b, a, c]
    const nMates = mates.map((id) => matesOf(id).length);
    // We can handle only [2,1,1] or [1,2,1] or [1,1,2]
    // so check for more than one 2:
    if (nMates.filter(nn => nn === 2).length !== 1) {
      throw new Error('Overly complicated 2-mate situation')
    }
    if (nMates[0] === 2) {
      mates.unshift(mates.pop()); // ror
    }
    else if (nMates[2] === 2) {
      mates.push(mates.shift()); // rol
    }
    // else no rearrangement is necessary
    return new TripleNode(id, mates);
  };

  const descend = function(generation) {
    for (let i = 0; i < generation.length; ++i) {
      const ms = matesOfMatesOf(generation[i].id);

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
      // eslint-disable-next-line no-undefined
      if (child.rightId === undefined) { // no mates => no children
        child.width = 1;
        width += child.width;
      }

      // eslint-disable-next-line no-undefined
      else if (child.leftId === undefined) { // one mate (on right)
        child.width = Math.max(2, computeWidth(child.children));
        width += child.width;
      }
      else {  // two mates
        child.leftWidth = Math.max(2, computeWidth(child.leftChildren));
        child.rightWidth = Math.max(2, computeWidth(child.rightChildren));
        width += child.leftWidth + child.rightWidth - 1;
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
        left: (x + 1) * gridSquareWidth - nodeRadius,
        top: (y + 0) * gridSquareHeight - nodeRadius + yOffset
      })
    );
  };

  const drawLine = function(coords) {
    ctx.beginPath();
    ctx.strokeStyle = '#fb4d3d';
    ctx.lineWidth = 6;
    ctx.moveTo((coords[0] + 1) * gridSquareWidth,
               (coords[1] + 0) * gridSquareHeight + yOffset);
    coords.splice(0, 2);
    while (coords.length) {
      ctx.lineTo((coords[0] + 1) * gridSquareWidth,
                 (coords[1] + 0) * gridSquareHeight + yOffset);
      coords.splice(0, 2);
    }
    ctx.stroke();
    ctx.closePath();
  };

  // eslint-disable-next-line max-params
  const drawJoin = function(parentx, parenty, x, y) {
    if (parentx === undefined) { // eslint-disable-line no-undefined
      return;
    }
    const midy = (parenty + y) / 2;

    drawLine([parentx, parenty, parentx, midy, x, midy, x, y]);
  };

  let selectedPersonId;
  const drawnIds = [];

  // eslint-disable-next-line max-params
  const drawSubtree = function(tree, left, level, parentx, parenty, parentw) {
    console.log(tree, left, level, parentx, parenty, parentw);;;
    if (level > maxLevel) {
      maxLevel = level;
    }

    let actualw = 0;

    (function computeActualWidth() {
      for (const node of tree) {
        // eslint-disable-next-line no-undefined
        if (node.rightId === undefined) { // single node
          actualw += 1;
        }

        // eslint-disable-next-line no-undefined
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
      const xl = left + (node.leftWidth - 1) / 2 + offset;
      const xr = left + (node.rightWidth - 1) / 2 + node.leftWidth + offset;
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
        drawnIds.push(personRight.id);
        drawnIds.push(personLeft.id);
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

      // eslint-disable-next-line no-undefined
      if (node.rightId === undefined) { // single node
        singleNode(node, person);
      }

      // eslint-disable-next-line no-undefined
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const regexResult = /family-tree-userId=(\d+)/.exec(document.cookie);

    if (regexResult === null) {
      return Materialize.toast('Cookie not found', 4000);
    }

    const userId = Number.parseInt(regexResult[1]);

    for (const person of persons) {
      if (person.user_id === userId) {
        selectedPersonId = person.id;
        break;
      }
    }
    const top = [{ id: findTop(selectedPersonId) }];

console.log(nodify(findTop(selectedPersonId)));;;
    descend(top);
    computeWidth(top);
console.log(top);;;

    drawnIds.length = 0;
    drawnIds.push(0);

    // eslint-disable-next-line no-undefined
    drawSubtree(top, (canvas.width / gridSquareWidth - 1 - top.width) / 2, 0, undefined, undefined, top.width);

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

  $('.tree-div').on('click', 'a.edit', popUpEditModal);
})();
