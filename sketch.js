import Ball from './src/ball.js';
import Sprite from './src/sprite.js'

let ball;
let spritesheet;
let spritedata;

let animation = [];
let newBall;

function preload() {
  spritedata = loadJSON('src/images/ball.json')
  spritesheet = loadImage('src/images/ball.png')
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  let frames = spritedata.frames;

  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);

    animation.push(img);
  }
  newBall = new Sprite(animation, .1);
  ball = new Ball(width / 2, 0, 50);
}

function draw() {
  background(25);
  fill(255, 30); // transparent for debug
  ball.draw();
  ball.update();
  stroke(0);
  textSize(200);
  textAlign(CENTER, CENTER);
  text(ball.hitCount, width / 2, height / 2);

  // image(animation[frameCount % animation.length], 0, 0);

  newBall.show();
  newBall.animate();
}

function mousePressed() {
  ball.clickEvent(mouseX, mouseY);
}

function touchStarted() {
  mousePressed();
}

window.mousePressed = mousePressed;
window.touchStarted = touchStarted;

window.preload = preload;
window.setup = setup;
window.draw = draw;
