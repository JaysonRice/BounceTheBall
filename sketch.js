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
const scoreWritten = false;

const balls = [];

const powerupSpawnScore = 10;
const multiBallRadius = 30;
let multiBallPowerup = null;
let powerupResolved = true;

let totalScore = 0;
let deadBallScore = 0;
let sessionBestScore = 0;

let spriteDataBall;
let spriteSheetBall;
let animationBall;

let spriteDataStar;
let spriteSheetStar;
let animationStar;

let hitSound;
let powerupSound;
let gameFont;

function preload() {
  spriteDataBall = loadJSON('src/assets/images/ball.json');
  spriteSheetBall = loadImage('src/assets/images/ball.png');
  spriteDataStar = loadJSON('src/assets/images/star.json');
  spriteSheetStar = loadImage('src/assets/images/star.png');
  hitSound = loadSound('src/assets/sounds/SoftHit.wav');
  powerupSound = loadSound('src/assets/sounds/PowerUp.wav');
  gameFont = loadFont('src/assets/fonts/FjallaOne-Regular.ttf');
}

const displayScore = (score, x = width / 2, y = height / 2, txtSize = 150) => {
  push();

  fill(255, 30);
  stroke(0);
  strokeWeight(1);

  textFont(gameFont);
  textSize(txtSize);
  textAlign(CENTER, CENTER);

  text(score, x, y);
  pop();
};

const displayBestScore = (score, x = 10, txtSize = 30) => {
  if (score === 0) return;

  push();

  fill(255, 30);
  // stroke(0);
  strokeWeight(1);

  textFont(gameFont);
  textSize(txtSize);
  textAlign(LEFT);

  text(`Best: ${score}`, x, txtSize + x);
  pop();
};

const readSpriteSheet = (spriteSheet, spriteData) => {
  const { frames } = spriteData;
  const animation = [];
  for (let i = 0; i < frames.length; i += 1) {
    const pos = frames[i].position;
    const img = spriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    animation.push(img);
  }

  return animation;
};

const spawnPowerup = () => {
  imageMode(CENTER);

  // If there isn't currently a powerup on screen, spawn one every X frames
  if (
    totalScore % powerupSpawnScore === 0
    && totalScore !== 0
    && powerupResolved
    && !multiBallPowerup
  ) {
    multiBallPowerup = new MultiBallPowerup(
      random(30, width - 30),
      -multiBallRadius / 2,
      multiBallRadius,
      animationStar,
      0.15,
      powerupSound,
    );
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
      const ball = new Ball(width / 2, 0, 50, animationBall, 0.15, hitSound);
      balls.push(ball);
      multiBallPowerup = null;
    }
    // If the powerup leaves the screen off the bottom, remove it
    if (multiBallPowerup && multiBallPowerup.pos.y > height + multiBallPowerup.radius) {
      multiBallPowerup = null;
    }
  }
};

const resetGame = () => {
  const ball = new Ball(width / 2, height * (3 / 4), 50, animationBall, 0.15, hitSound);
  ball.frozen = true;

  if (totalScore > sessionBestScore) {
    sessionBestScore = totalScore;
  }

  totalScore = 0;
  deadBallScore = 0;

  balls.splice(0, balls.length);
  balls.push(ball);
  multiBallPowerup = null;
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  userId = uuid();

  imageMode(CENTER);

  animationBall = readSpriteSheet(spriteSheetBall, spriteDataBall);
  animationStar = readSpriteSheet(spriteSheetStar, spriteDataStar);

  resetGame();
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

  if (balls.length === 1 && balls[0].frozen) {
    push();
    textAlign(CENTER);
    textSize(50);
    text('Bounce\nthe Ball', width / 2, height / 4);
    pop();

    displayBestScore(sessionBestScore);
  }

  balls.forEach((ball) => {
    ball.draw();
    ball.update();
  });

  // Logic for handling multiball powerup
  spawnPowerup();

  // Removing dead balls from the array
  for (let i = 0; i < balls.length; i += 1) {
    if (balls[i].dead === true) {
      deadBallScore += balls[i].hitCount;
      balls.splice(i, 1);
    }
  }
  totalScore = balls.reduce((accum, curr) => accum + curr.hitCount, 0);
  totalScore += deadBallScore;

  displayScore(totalScore);

  // TODO: put this logic elsewhere and change logic to know if all balls are gone from array
  if (balls.length < 1) {
    resetGame();
    // if (!scoreWritten && totalScore > 0 && !DEBUG) {
    //   const scoreRecord = {
    //     userId,
    //     score: totalScore,
    //     userName: 'JMR',
    //   };
    //   console.log('it worked');
    //   writeDynamoRecord(docClient, scoreRecord);
    //   scoreWritten = true;
    // }
  }
}

window.mousePressed = mousePressed;
window.touchStarted = touchStarted;

window.preload = preload;
window.setup = setup;
window.draw = draw;
