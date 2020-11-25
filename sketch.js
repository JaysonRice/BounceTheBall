import Ball from './src/ball.js';

let ball;

const displayScore = (score, x = width / 2, y = height / 2, txtSize = 200) => {
  push();

  // These were the global settings when refactored
  // moved into here to isolate from global settings
  // (i.e. potentially redundant but feels safer).
  fill(255, 30);
  stroke(0);
  strokeWeight(1);

  textSize(txtSize);
  textAlign(CENTER, CENTER);

  text(score, x, y);
  pop();
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  ball = new Ball(width / 2, 0, 50);
}

function mousePressed() {
  ball.clickEvent(mouseX, mouseY);
}

function touchStarted() {
  mousePressed();
}

function draw() {
  background(25);
  fill(255, 30);

  ball.draw();
  ball.update();

  displayScore(ball.hitCount);
}

window.mousePressed = mousePressed;
window.touchStarted = touchStarted;

window.setup = setup;
window.draw = draw;
