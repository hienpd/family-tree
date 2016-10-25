/* eslint-disable max-lines */
/* global popUpEditModal:false */
// eslint-disable-next-line max-statements
(function() {
  'use strict';

  const gridSquareWidth = 128;
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
    const unknownPersons = [];
    for (const person of persons) {
      personsById[person.id] = person;
      maxId = Math.max(maxId, person.id);
      if (person.parents[0] === null) {
        person.parents.length = 0;
      }
    }
    for (const person of persons) {
      if (person.parents.length === 1) {  // just one parent?
        maxId += 1;                       // create fictitious parent
        person.parents.push(maxId);
        const unknownPerson = {
          id: maxId,
          given_name: '?',
          family_name: '!',
          parents: []
        };
        unknownPersons.push(unknownPerson);
        personsById[unknownPerson.id] = unknownPerson;
      }
    }
    persons.push(...unknownPersons);
    maxPeople = maxId + 1;

    // init materix
    materix = Array(maxPeople).fill().map(() => []); // maxPeople x maxPeople

    // materix[a.id][b.id] => a is a mate of b (i.e. a and b
    // are parents of the same child).
    // As it happens, it is useful for materix[a.id][a.id] (and [b][b])
    // to be true as well.
    for (const person of persons) {
      if (person.parents.length === 2) {
        materix[person.parents[0]][person.parents[0]] = true;
        materix[person.parents[0]][person.parents[1]] = true;
        materix[person.parents[1]][person.parents[0]] = true;
        materix[person.parents[1]][person.parents[1]] = true;
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
    // matesOf(a) = [a, b] // order is not important
    // matesOf(b) = [a, b, c]
    // matesOf(c) = [b, c]
    // but matesOfMatesOf(a) = matesOfMatesOf(b) = matesOfMatesOf(c) = [a,b,c]
    const mates = matesOf(id);
    let changed;

    do {
      changed = false;
      for (const m of mates) {
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
  };

  const sumWidths = function(nodes) {
    // Return the sum of the widths of the nodes.
    return nodes.reduce((acc, node) => acc + node.width, 0);
  };

  class SingleNode {
    // Represents a person with no mates.
    constructor (id) {
      this.id = id;
      this.width = 1;
    }
    draw(left, level, parentx, parenty, parentw) {
      const offset = (parentw - 1) / 2 + 0.5; // horizontal offset to center node.
      drawNodeEx(this.id, left + offset, level);
      drawJoin(parentx, parenty, left + offset, level);
    }
  }

  class DoubleNode {
    // Represents a person with one mate.
    constructor (id, mateId) {
      this.id = id;
      this.mateId = mateId;
      this.children = childrenOf(id, mateId).map((child) => nodify(child));
      this.width = Math.max(2, sumWidths(this.children));
    }
    draw(left, level, parentx, parenty, parentw) {
      const offset = (parentw - 2) / 2 + 0.5; // horizontal offset to center double node.
      drawNodeEx(this.id, left + offset, level);
      drawNodeEx(this.mateId, left + offset + 1, level);
      drawJoin(parentx, parenty, left + offset, level);
      drawLine([left + offset, level, left + offset + 1, level])
      const childrenWidth = sumWidths(this.children);
      const childrenLeft = left + (parentw - childrenWidth) / 2;
      drawNodes(this.children, childrenLeft, level + 1, left + offset + 0.5, level, childrenWidth);
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
      this.width = Math.max(1.5, sumWidths(this.leftChildren))
                 + Math.max(1.5, sumWidths(this.rightChildren));
    }
    draw(left, level, parentx, parenty, parentw) {
      const leftActualWidth = sumWidths(this.leftChildren);
      const rightActualWidth = sumWidths(this.rightChildren);
      const leftLeft = left + (leftActualWidth === 1 ? 0.5 : 0);
      const rightLeft = leftLeft + leftActualWidth;
      const xs = []; // x-coords of three nodes
      xs[0] = left + leftActualWidth / 2 - 0.5 + (leftActualWidth === 1 ? 0.5 : 0);
      xs[2] = leftLeft + leftActualWidth + rightActualWidth / 2 + 0.5;
      xs[1] = (xs[0] + xs[2]) / 2;
      drawNodeEx(this.ids[0], xs[0], level);
      drawNodeEx(this.ids[1], xs[1], level);
      drawNodeEx(this.ids[2], xs[2], level);
      drawLine([xs[0], level, xs[2], level]);
      drawJoin(parentx, parenty, xs[this.ids.indexOf(this.id)], level);
      drawNodes(this.leftChildren, leftLeft, level + 1, xs[0] + 0.5, level, leftActualWidth);
      drawNodes(this.rightChildren, rightLeft, level + 1, xs[2] - 0.5, level, rightActualWidth);
    }
  }

  const drawNodes = function(nodes, left, level, parentx, parenty, parentw) {
    for (const node of nodes) {
      node.draw(left, level, parentx, parenty, node.width);
      left += node.width;
    }
  }

  const drawNodeEx = function(id, x, y) {
    const person = personsById[id];
    drawNode(`${person.given_name} ${person.family_name}`, person.id, selectedPersonId, x, y);
  };

  const nodify = function(id) {
    // Given an id, creates an appropriate Node and its
    // subtrees; returns the Node.
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
    // have two mates each and the third has three mates. E.g.
    // matesOf(a) = a, c
    // matesOf(b) = b, c
    // matesOf(c) = a, b, c
    // We want the one with three mates to be in the middle: [a, c, b]
    const nMates = mates.map((id) => matesOf(id).length);
    // We can handle only [3,2,2] or [2,3,2] or [2,2,3]
    // so check for more than one 3:
    if (nMates.filter(nn => nn === 3).length !== 1) {
      throw new Error('Overly complicated 2-mate situation')
    }
    if (nMates[0] === 3) {
      mates.unshift(mates.pop()); // ror
    }
    else if (nMates[2] === 3) {
      mates.push(mates.shift()); // rol
    }
    // else no rearrangement is necessary
    return new TripleNode(id, mates);
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
        left: x * gridSquareWidth - nodeRadius,
        top: y * gridSquareHeight - nodeRadius + yOffset
      })
    );
  };

  const drawLine = function(coords) {
    ctx.beginPath();
    ctx.strokeStyle = '#fb4d3d';
    ctx.lineWidth = 6;
    ctx.moveTo(coords[0] * gridSquareWidth,
               coords[1] * gridSquareHeight + yOffset);
    coords.splice(0, 2);
    while (coords.length) {
      ctx.lineTo(coords[0] * gridSquareWidth,
                 coords[1] * gridSquareHeight + yOffset);
      coords.splice(0, 2);
    }
    ctx.stroke();
  };

  // eslint-disable-next-line max-params
  const drawJoin = function(parentx, parenty, x, y) {
    if (parentx === null) {
      return;
    }
    const midy = (parenty + y) / 2;

    drawLine([parentx, parenty, parentx, midy, x, midy, x, y]);
  };

  let selectedPersonId;
  const drawnIds = [];

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

    drawnIds.length = 0;
    drawnIds.push(0);

    const topNode = nodify(findTop(selectedPersonId));
    const offset = (canvas.width / gridSquareWidth - topNode.width) / 2;
    topNode.draw(offset, 0, null, null, topNode.width);

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
    })//();
  };

  $('.tree-div').on('click', 'a.edit', popUpEditModal);
})();
