import Ball from './src/ball.js';

let ball;
let spritesheet;
let spritedata;

let animation = [];

function preload() {
  spritedata = loadJSON('src/images/ball.json')
  spritesheet = loadImage('src/images/ball.png')
}

function setup() {
  preload()
  createCanvas(windowWidth, windowHeight);
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
  image(spritesheet, 0, 0);
}

function mousePressed() {
  ball.clickEvent(mouseX, mouseY);
}

function touchStarted() {
  mousePressed();
}

window.mousePressed = mousePressed;
window.touchStarted = touchStarted;


window.setup = setup;
window.draw = draw;
