import Ball from './src/ball.js';
import Sprite from './src/sprite.js'

let ball;
let spritesheet;
let spritedata;

let animation = [];
let newBall;

function preload() {
  // Image data to load for animated sprites
  // Currently have ball2 or ball3
  spritedata = loadJSON('src/images/ball3.json')
  spritesheet = loadImage('src/images/ball3.png')
}

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
  text(ball.hitCount, width / 2, height / 2);

  text(score, x, y);
  pop();
};

function setup() {
  createCanvas(windowWidth, windowHeight);

  let frames = spritedata.frames;
  // Find the position of each sprite on the spritesheet to display
  // One at a time
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);

    animation.push(img);
  }
  newBall = new Sprite(animation, .15);
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

  //  Sprite animations
  newBall.show();
  newBall.animate();

  ball.draw();
  ball.update();

  displayScore(ball.hitCount);
}

window.mousePressed = mousePressed;
window.touchStarted = touchStarted;

window.preload = preload;
window.setup = setup;
window.draw = draw;