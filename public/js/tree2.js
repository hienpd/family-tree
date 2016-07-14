const canvas = $('#canvas')[0];
const ctx = canvas.getContext('2d');
const g_w = 120;
const g_h = 50;
const n = 13;
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

drawNode('Bob Belcher', 1, 0, 0);
drawNode('Tina Belcher', 2, g_w, g_h);
drawNode('Louise Belcher', 2, g_w * 2, g_h);
