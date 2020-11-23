import Ball from './src/ball.js';

let ball;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ball = new Ball(width / 2, 0, 50);
}

function draw() {
  background(25);
  fill(255, 30); // transparent for debug
  ball.draw();
  ball.update();
  stroke(0)
  textSize(200)
  textAlign(CENTER, CENTER)
  text(ball.hitCount, width / 2, height / 2)
}

function mouseClicked() {
  ball.clickEvent(mouseX, mouseY);
}

function touchStarted() {
  mouseClicked();
}

window.mouseClicked = mouseClicked;
window.touchStarted = touchStarted;

window.setup = setup;
window.draw = draw;
