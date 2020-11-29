import Ball from './src/ball.js';
import { writeDynamoRecord, uuid } from './src/helpers/dynamoDB.js';

AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-1:a90822a4-fcf5-4a93-9e59-c94743e49040',
});

// TO STOP WRITES TO DB
// TO STOP WRITES TO DB
// TO STOP WRITES TO DB
const DEBUG = false;

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();
let userId;
// TODO: have gameover event/restart screen handle this
let scoreWritten = false;


const balls = [];
let spritesheet;
let spritedata;
let hitSound;
let gameFont;
let deadBallScore;

const animation = [];

function preload() {
  spritedata = loadJSON('src/assets/images/ball.json');
  spritesheet = loadImage('src/assets/images/ball.png');
  hitSound = loadSound('src/assets/sounds/SoftHit.wav');
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
}

function touchStarted() {
  mousePressed();
}

function draw() {
  background(25);
  fill(255, 30);

  balls.forEach(ball => {
    ball.draw();
    ball.update();
  });

  // Removing dead balls from the array
  balls.filter((ball) => {
    if (!ball.offScreen) return true;

    deadBallScore += ball.hitCount;
    return false;
  });

  let totalScore = balls.reduce((accum, curr) => accum + curr.hitCount, 0);
  // totalScore += deadBallScore

  displayScore(totalScore);

  if (totalScore % 10 === 0) {
    const ball = new Ball(width / 2, 0, 50, animation, 0.15, hitSound);
    balls.push(ball);
  }
}



// displayScore(ball.hitCount);

// TODO: put this logic elsewhere and change logic to know if all balls are gone from array
//   if (ball.pos.y - ball.radius > height && !scoreWritten && ball.hitCount > 0 && !DEBUG) {
//     const scoreRecord = {
//       userId,
//       score: ball.hitCount,
//       userName: 'JMR',
//     };
//     writeDynamoRecord(docClient, scoreRecord);
//     scoreWritten = true;
//   }
// }

window.mousePressed = mousePressed;
window.touchStarted = touchStarted;

window.preload = preload;
window.setup = setup;
window.draw = draw;
