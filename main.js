let canvas_container = document.getElementById("canvas-container");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let side = canvas_container.offsetHeight;
let playing = true;
let movement = {
  up: false,
  down: false,
  left: false,
  right: false
};
let player;
let playerDistance = 0;
let projectileGroup = [];
let score = 0;
init();
setInterval(() => {
  if (playing) frame();
}, 1000 / 60);
function init() {
  player = new Shadow(0, side / 2, 2, 0);
}
function frame() {
  side = canvas_container.offsetHeight;
  if (canvas.width != side || canvas.height != side) {
    canvas.width = side;
    canvas.height = side;
    canvas_container.style.width = side;
    ctx.font = "30px Arial";
  }
  if (movement.up) player.y -= player.speed;
  if (movement.down) player.y += player.speed;
  if (movement.right) player.x += player.speed;
  if (movement.left) player.x -= player.speed;
  playerDistance =
    -(distance(player.x, player.y, side / 2, side / 2) / side / 0.7) + 1;
  ctx.fillStyle = `hsla(0, 0%, ${playerDistance * 100}%, 0.05)`;
  ctx.fillRect(0, 0, side, side);
  score += playerDistance;
  player.render();
  if (Math.random() < 0.1) {
    projectileGroup.push(new Projectile(side / 2, side / 2));
  }
  for (let i = 0; i < projectileGroup.length; i++) {
    projectileGroup[i].movement();
    projectileGroup[i].render();
    if (
      distance(player.x, player.y, projectileGroup[i].x, projectileGroup[i].y) <
      15
    )
      playing = false;
  }
  ctx.fillStyle = "white";
  ctx.fillText(Math.floor(score), 0, 30);
}
document.addEventListener("keydown", ev => {
  setMovement(ev.key, true);
});
document.addEventListener("keyup", ev => {
  setMovement(ev.key, false);
});
function setMovement(key, val) {
  if (key == "ArrowUp" || key == "w") {
    movement.up = val;
  } else if (key == "ArrowDown" || key == "s") {
    movement.down = val;
  } else if (key == "ArrowRight" || key == "d") {
    movement.right = val;
  } else if (key == "ArrowLeft" || key == "a") {
    movement.left = val;
  }
}
function noise(magnitude) {
  return Math.random() * magnitude - magnitude / 2;
}
function Shadow(x, y, speed, tint) {
  this.speed = speed;
  this.width = 20;
  this.x = x;
  this.y = y;
  this.color = `hsla(${tint},70%,10%,1)`;
  this.render = () => {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x + noise(10),
      this.y + noise(10),
      this.width,
      this.width
    );
  };
}
function Projectile(x, y) {
  this.width = 10;
  this.x = x;
  this.y = y;
  this.movex = noise(5);
  this.movey = noise(5);
  this.render = () => {
    ctx.fillStyle = `hsla(${120},70%,${playerDistance * 50}%,1)`;
    ctx.fillRect(
      this.x + noise(10),
      this.y + noise(10),
      this.width,
      this.width
    );
  };
  this.movement = () => {
    this.x += this.movex;
    this.y += this.movey;
  };
}
function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
