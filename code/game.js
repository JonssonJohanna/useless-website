const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// General
canvas.width = 500;
canvas.height = 500;

let x = canvas.width / 2;
let y = canvas.height - 30;

let score = 0;

let lives = 3;

// Ball
const ball_radius = 10;
let dx = 3;
let dy = -3;

// Platform
const platform_width = 75;
const platform_height = 10;
let platform_x = (canvas.width - platform_height) / 2;

//Controlls
let right_pressed = false;
let left_pressed = false;

// Bricks
const brick_row_count = 3;
const brick_coloumn_count = 6;
const brick_width = 75;
const brick_height = 25;
const brick_padding = 5;
const brick_margin_top = 80;
const brick_margin_left = 5;

let bricks = [];
for (let c = 0; c < brick_coloumn_count; c++) {
  bricks[c] = [];
  for (let r = 0; r < brick_row_count; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener('keydown', key_down_handler, false);
document.addEventListener('keyup', key_up_handler, false);
document.addEventListener('mousemove', mouse_move_handler, false);

function key_down_handler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    right_pressed = true;
    console.log('right!');
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    left_pressed = true;
  }
}

function key_up_handler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    right_pressed = false;
    console.log('right!');
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    left_pressed = false;
  }
}

function mouse_move_handler(e) {
  let relative_x = e.clientX - canvas.offsetLeft;
  if (relative_x > 0 && relative_x < canvas.width) {
    platform_x = relative_x - platform_width / 2;
  }
}

const collision_detection = function () {
  for (let c = 0; c < brick_coloumn_count; c++) {
    for (let r = 0; r < brick_row_count; r++) {
      const b = bricks[c][r];
      if (b.status == 1) {
        if (
          x + Math.PI * 2 > b.x &&
          x < b.x + brick_width &&
          y + Math.PI * 2 > b.y &&
          y < b.y + brick_height
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brick_coloumn_count * brick_row_count) {
            alert('YOU WON! 💖');
            document.location.reload();
            clearInterval(interval);
          }
        }
      }
    }
  }
};

const draw_ball = function () {
  ctx.beginPath();
  ctx.arc(x, y, ball_radius, 0, Math.PI * 2);
  ctx.fillStyle = 'pink';
  ctx.fill();
  ctx.closePath();
};

const draw_platform = function () {
  ctx.beginPath();
  ctx.rect(
    platform_x,
    canvas.height - platform_height,
    platform_width,
    platform_height
  );
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
};

const draw_bricks = function () {
  for (let c = 0; c < brick_coloumn_count; c++) {
    for (let r = 0; r < brick_row_count; r++) {
      if (bricks[c][r].status == 1) {
        let brick_x = c * (brick_width + brick_padding) + brick_margin_left;
        let brick_y = r * (brick_height + brick_padding) + brick_margin_top;
        bricks[c][r].x = brick_x;
        bricks[c][r].y = brick_y;
        ctx.beginPath();
        ctx.rect(brick_x, brick_y, brick_width, brick_height);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

const draw_score = function () {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('SCORE: ' + score, 8, 20);
};

const draw_lives = function () {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
};

const draw = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw_ball();
  draw_platform();
  draw_bricks();
  collision_detection();
  draw_score();
  draw_lives();

  if (right_pressed) {
    platform_x += 7;
    if (platform_x + platform_width > canvas.width) {
      platform_x = canvas.width - platform_width;
    }
  }
  if (left_pressed) {
    platform_x -= 7;
    if (platform_x < 0) {
      platform_x = 0;
    }
  }

  if (x + dx + ball_radius > canvas.width || x + dx - ball_radius < 0) {
    dx = -dx;
  }
  if (y + dy < ball_radius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ball_radius) {
    if (x >= platform_x && x <= platform_x + platform_width / 2) {
      dx = -((platform_x + platform_width) / 100);
      dy = -dy;
    } else if (x >= platform_x && x <= platform_x + platform_width) {
      dx = (platform_x + platform_width) / 100;
      dy = -dy;
    } else {
      lives--;

      x = canvas.width / 2;
      y = canvas.height - 30;
      dx = 3;
      dy = -3;
      platform_x = (canvas.width - platform_width) / 2;

      if (lives == 0) {
        alert('GAME OVER 😢');
        document.location.reload();
        clearInterval(interval);
      }
    }
  }

  x += dx;
  y += dy;
};

let interval = setInterval(draw, 10);
