var step = 0;

draw_axes();

get_and_draw();

var scale_k = document.getElementById("scale_f").value;


var transform_m_1 = [[-1 * scale_k, 0, 0], [0, 1 * scale_k, 0], [0, 0, 1]]
var transform_m_2 = [[1 * scale_k, 0, 0], [0, -1 * scale_k, 0], [0, 0, 1]]

var is_move = false;

var ax1, ay1, bx1, by1, cx1, cy1 = 0;


function change_scale() {
  scale_k = document.getElementById("scale_f").value;
  console.log("Scale changed", scale_k);

    
  transform_m_1 = [[-1 * scale_k, 0, 0], [0, 1 * scale_k, 0], [0, 0, 1]]
  transform_m_2 = [[1 * scale_k, 0, 0], [0, -1 * scale_k, 0], [0, 0, 1]]
}

function multiply(a, b) {
  var aNumRows = a.length, aNumCols = a[0].length,
    bNumRows = b.length, bNumCols = b[0].length,
    m = new Array(aNumRows);  // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0;             // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  return m;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



async function transform() {

  is_move = true;

  while (is_move) {

    let old_matrix = [[ax1, ay1, 1], [bx1, by1, 1], [cx1, cy1, 1]]

    if (step % 2 == 0) {
      step++;
      let new_m = multiply(old_matrix, transform_m_1);
      console.log(new_m)
      draw(new_m[0][0], new_m[0][1], new_m[1][0], new_m[1][1], new_m[2][0], new_m[2][1])
    } else {
      step++;
      let new_m = multiply(old_matrix, transform_m_2);
      console.log(new_m)
      draw(new_m[0][0], new_m[0][1], new_m[1][0], new_m[1][1], new_m[2][0], new_m[2][1])
    }

    await sleep(3 * 1000);
  }
  console.log('Done');
}


function get_and_draw() {
  var ax = document.getElementById("a_tr_range_x").value
  var ay = -document.getElementById("a_tr_range_y").value

  var bx = document.getElementById("b_tr_range_x").value
  var by = -document.getElementById("b_tr_range_y").value

  var cx = document.getElementById("c_tr_range_x").value
  var cy = -document.getElementById("c_tr_range_y").value

  draw(ax, ay, bx, by, cx, cy);
}


function stop() {
  is_move = false;
  console.log("Stopped", is_move);
  get_and_draw();

}

function draw(ax, ay, bx, by, cx, cy) {

  ax1 = ax; ay1 = ay; bx1 = bx; by1 = by; cx1 = cx; cy1 = cy;

  console.log(ax, ay, bx, by, cx, cy)

  const canvas = document.getElementById('tr_canvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    ctx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw_axes();

    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.font = '12px serif';
    ctx.fillText('A', ax, ay);
    ctx.lineTo(bx, by);
    ctx.fillText('B', bx, by);
    ctx.lineTo(cx, cy);
    ctx.fillText('C', cx, cy);
    ctx.closePath();
    ctx.stroke();
  }
}

function draw_axes() {
  var grid_size = 5;
  var x_axis_distance_grid_lines = 28;
  var y_axis_distance_grid_lines = 55;
  var x_axis_starting_point = { number: 1, suffix: '' };
  var y_axis_starting_point = { number: 1, suffix: '' };

  var canvas = document.getElementById("tr_canvas");
  var ctx = canvas.getContext("2d");

  var canvas_width = canvas.width;
  var canvas_height = canvas.height;

  console.log(canvas_width, canvas_height)


  var num_lines_x = Math.floor(canvas_height / grid_size);
  var num_lines_y = Math.floor(canvas_width / grid_size);

  // Draw grid lines along X-axis
  for (var i = 0; i <= num_lines_x; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    // If line represents X-axis draw in different color
    if (i == x_axis_distance_grid_lines)
      ctx.strokeStyle = "#000000";
    else
      ctx.strokeStyle = "#e9e9e9";

    if (i == num_lines_x) {
      ctx.moveTo(0, grid_size * i);
      ctx.lineTo(canvas_width, grid_size * i);
    }
    else {
      ctx.moveTo(0, grid_size * i + 0.5);
      ctx.lineTo(canvas_width, grid_size * i + 0.5);
    }
    ctx.stroke();
  }

  // Draw grid lines along Y-axis
  for (i = 0; i <= num_lines_y; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;

    // If line represents X-axis draw in different color
    if (i == y_axis_distance_grid_lines)
      ctx.strokeStyle = "#000000";
    else
      ctx.strokeStyle = "#e9e9e9";

    if (i == num_lines_y) {
      ctx.moveTo(grid_size * i, 0);
      ctx.lineTo(grid_size * i, canvas_height);
    }
    else {
      ctx.moveTo(grid_size * i + 0.5, 0);
      ctx.lineTo(grid_size * i + 0.5, canvas_height);
    }
    ctx.stroke();
  }


  ctx.save();


  // Translate to the new origin. Now Y-axis of the canvas is opposite to the Y-axis of the graph. So the y-coordinate of each element will be negative of the actual
  ctx.translate(y_axis_distance_grid_lines * grid_size, x_axis_distance_grid_lines * grid_size);

  // Ticks marks along the positive X-axis
  for (i = 1; i < (num_lines_y - y_axis_distance_grid_lines); i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";

    // Draw a tick mark 6px long (-3 to 3)
    ctx.moveTo(grid_size * i + 0.5, -3);
    ctx.lineTo(grid_size * i + 0.5, 3);
    ctx.stroke();

    // Text value at that point
    ctx.font = '9px Arial';
    ctx.textAlign = 'start';
    ctx.fillText(x_axis_starting_point.number * i * 25 + x_axis_starting_point.suffix, grid_size * i * 5 - 5, 15);
  }

  // Ticks marks along the negative X-axis
  for (i = 1; i < y_axis_distance_grid_lines; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";

    // Draw a tick mark 6px long (-3 to 3)
    ctx.moveTo(-grid_size * i + 0.5, -3);
    ctx.lineTo(-grid_size * i + 0.5, 3);
    ctx.stroke();

    // Text value at that point
    ctx.font = '9px Arial';
    ctx.textAlign = 'end';
    ctx.fillText(-x_axis_starting_point.number * i * 25 + x_axis_starting_point.suffix, -grid_size * i * 5 + 10, 15);
  }

  // Ticks marks along the positive Y-axis
  // Positive Y-axis of graph is negative Y-axis of the canvas
  for (i = 1; i < (num_lines_x - x_axis_distance_grid_lines); i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";

    // Draw a tick mark 6px long (-3 to 3)
    ctx.moveTo(-3, grid_size * i + 0.5);
    ctx.lineTo(3, grid_size * i + 0.5);
    ctx.stroke();

    // Text value at that point
    ctx.font = '9px Arial';
    ctx.textAlign = 'start';
    ctx.fillText(-y_axis_starting_point.number * i * 25 + y_axis_starting_point.suffix, 8, grid_size * i * 5 + 3);
  }

  // Ticks marks along the negative Y-axis
  // Negative Y-axis of graph is positive Y-axis of the canvas
  for (i = 1; i < x_axis_distance_grid_lines; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";

    // Draw a tick mark 6px long (-3 to 3)
    ctx.moveTo(-3, -grid_size * i + 0.5);
    ctx.lineTo(3, -grid_size * i + 0.5);
    ctx.stroke();

    // Text value at that point
    ctx.font = '9px Arial';
    ctx.textAlign = 'start';
    ctx.fillText(y_axis_starting_point.number * i * 25 + y_axis_starting_point.suffix, 8, -grid_size * i * 5 + 3);
  }
}

function download() {
  var canvas = document.getElementById("tr_canvas");
  var anchor = document.createElement("a");
  anchor.href = canvas.toDataURL("image/png");
  anchor.download = "IMAGE.PNG";
  anchor.click();
}