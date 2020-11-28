import Ball from './src/ball.js';

let ball;
let spritesheet;
let spritedata;
let hitSound;
let gameFont;

const animation = [];

function preload() {
  spritedata = loadJSON('src/assets/images/ball.json');
  spritesheet = loadImage('src/assets/images/ball.png');
  hitSound = loadSound('src/assets/sounds/SoftHit.wav');
  gameFont = loadFont('src/assets/fonts/FjallaOne-Regular.ttf')
}

const displayScore = (score, x = width / 2, y = height / 2, txtSize = 150) => {
  push();

  // These were the global settings when refactored
  // moved into here to isolate from global settings
  // (i.e. potentially redundant but feels safer).
  fill(255, 30);
  stroke(0);
  strokeWeight(1);

  textFont(gameFont);
  textSize(txtSize);
  textAlign(CENTER, CENTER);
  text(ball.hitCount, width / 2, height / 2);

  text(score, x, y);
  pop();
};

function setup() {
  createCanvas(windowWidth, windowHeight);

  imageMode(CENTER);

  const { frames } = spritedata;
  // Find the position of each sprite on the spritesheet to display
  // One at a time
  for (let i = 0; i < frames.length; i += 1) {
    const pos = frames[i].position;
    const img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);

    animation.push(img);
  }
  ball = new Ball(width / 2, 0, 50, animation, 0.15, hitSound);
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
  ball.animate();
  ball.update();

  displayScore(ball.hitCount);
}

window.mousePressed = mousePressed;
window.touchStarted = touchStarted;

window.preload = preload;
window.setup = setup;
window.draw = draw;
