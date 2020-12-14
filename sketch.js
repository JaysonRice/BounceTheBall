import Ball from './src/ball.js';
import MultiBallPowerup from './src/multiball.js';
import { writeDynamoRecord, uuid } from './src/helpers/dynamoDB.js';

AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-1:a90822a4-fcf5-4a93-9e59-c94743e49040',
});

// TO STOP WRITES TO DB
// TO STOP WRITES TO DB
// TO STOP WRITES TO DB
const DEBUG = true;

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();
let userId;
// TODO: have gameover event/restart screen handle this
let scoreWritten = false;

const balls = [];

const powerupSpawnScore = 10;
const multiBallRadius = 30;
let multiBallPowerup = null;
let powerupResolved = true;

let totalScore = 0;
let deadBallScore = 0;

let spritesheet;
let spritedata;
let spritedataStar;
let spritesheetStar;
let hitSound;
let powerupSound;
let gameFont;
const animation = [];
const animationStar = [];

function preload() {
  spritedata = loadJSON('src/assets/images/ball.json');
  spritesheet = loadImage('src/assets/images/ball.png');
  spritedataStar = loadJSON('src/assets/images/star.json');
  spritesheetStar = loadImage('src/assets/images/star.png');
  hitSound = loadSound('src/assets/sounds/SoftHit.wav');
  powerupSound = loadSound('src/assets/sounds/PowerUp.wav');
  gameFont = loadFont('src/assets/fonts/FjallaOne-Regular.ttf');
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

  text(score, x, y);
  pop();
};

const spawnPowerup = () => {
  imageMode(CENTER);

  const { frames } = spritedataStar;
  for (let i = 0; i < frames.length; i += 1) {
    const pos = frames[i].position;
    const img = spritesheetStar.get(pos.x, pos.y, pos.w, pos.h);

    animationStar.push(img);
  }

  // If there isn't currently a powerup on screen, spawn one every X frames
  if (totalScore % powerupSpawnScore === 0 && totalScore !== 0 && powerupResolved && !multiBallPowerup) {
    multiBallPowerup = new MultiBallPowerup(random(30, width - 30), -multiBallRadius / 2, multiBallRadius, animationStar, 0.15, powerupSound);
  }

  // Logic to stop powerups from spawning as soon as they disappear
  if (totalScore % powerupSpawnScore === 0) {
    powerupResolved = false;
  } else {
    powerupResolved = true;
  }

  if (multiBallPowerup) {
    multiBallPowerup.draw();
    multiBallPowerup.update();
    // If the powerup is hit, spawn a new ball and remove the powerup
    if (multiBallPowerup.powerupIsHit) {
      const ball = new Ball(width / 2, 0, 50, animation, 0.15, hitSound);
      balls.push(ball);
      multiBallPowerup = null;
    }
    // If the powerup leaves the screen off the bottom, remove it
    if (multiBallPowerup && multiBallPowerup.pos.y > height + multiBallPowerup.radius) {
      multiBallPowerup = null;
    }
  }
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  userId = uuid();

  imageMode(CENTER);

  const { frames } = spritedata;
  // Find the position of each sprite on the spritesheet to display
  // One at a time
  for (let i = 0; i < frames.length; i += 1) {
    const pos = frames[i].position;
    const img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);

    animation.push(img);
  }
  const ball = new Ball(width / 2, 0, 50, animation, 0.15, hitSound);
  balls.push(ball);
}

function mousePressed() {
  balls.forEach((ball) => ball.clickEvent(mouseX, mouseY));
  if (multiBallPowerup) {
    multiBallPowerup.clickEvent(mouseX, mouseY);
  }
}

function touchStarted() {
  mousePressed();
  return false;
}

function draw() {
  background(25);
  fill(255, 30);

  balls.forEach((ball) => {
    ball.draw();
    ball.update();
  });

  // Logic for handling multiball powerup
  spawnPowerup();

  // Removing dead balls from the array
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].dead === true) {
      deadBallScore += balls[i].hitCount;
      balls.splice(i, 1);
    }
  }
  totalScore = balls.reduce((accum, curr) => accum + curr.hitCount, 0);
  totalScore += deadBallScore;

  displayScore(totalScore);

  // TODO: put this logic elsewhere and change logic to know if all balls are gone from array
  if (balls.length < 1 && !scoreWritten && totalScore > 0 && !DEBUG) {
    const scoreRecord = {
      userId,
      score: totalScore,
      userName: 'JMR',
    };
    console.log('it worked');
    writeDynamoRecord(docClient, scoreRecord);
    scoreWritten = true;
  }
}

window.mousePressed = mousePressed;
window.touchStarted = touchStarted;

window.preload = preload;
window.setup = setup;
window.draw = draw;
