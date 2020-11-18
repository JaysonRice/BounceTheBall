const canvasW = 512;
const canvasH = 512;

let y = 0;
let speed = 4;

function setup() {
  createCanvas(canvasW, canvasH);
}

function draw() {
  background(25);
  stroke(255);
  strokeWeight(4);
  noFill();
  ellipse(canvasH / 2, y, 100, 100);

  if (y > height) {
    speed = -4;
  }

  y += speed;
}

window.setup = setup;
window.draw = draw;
