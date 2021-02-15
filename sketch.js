/* eslint-disable no-undef */
/* eslint-disable import/extensions */
import Ball from './src/classes/ball.js';
import { displayBestScore, displayScore } from './src/helpers/displayScores.js';
import { readHighScoreCookie, writeHighScoreCookie } from './src/helpers/saveHighScoreCookie.js';
import MultiBallPowerup from './src/classes/multiball.js';
import readSpriteSheet from './src/helpers/readSpritesheet.js';
import AddToHomeSceenButton from './src/classes/addToHomeScreenBtn.js';

const balls = [];

const powerupSpawnScore = 10;
const multiBallRadius = 30;
let multiBallPowerup = null;
let powerupResolved = true;
let resize;

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
let fontAwesomeIcons;

let confirmInstallPrompt;
let appIsInstalled = true;
let addToHomeScreenBtn;

const handleInstallPromptEvent = (event) => {
  confirmInstallPrompt = event;
  appIsInstalled = false;

  if (addToHomeScreenBtn) {
    addToHomeScreenBtn.prompt = confirmInstallPrompt;
    addToHomeScreenBtn.installed = appIsInstalled;
  }
};

function preload() {
  spriteDataBall = loadJSON('src/assets/images/ball.json');
  spriteSheetBall = loadImage('src/assets/images/ball.png');
  spriteDataStar = loadJSON('src/assets/images/star.json');
  spriteSheetStar = loadImage('src/assets/images/star.png');
  hitSound = loadSound('src/assets/sounds/SoftHit.wav');
  powerupSound = loadSound('src/assets/sounds/PowerUp.wav');
  gameFont = loadFont('src/assets/fonts/FjallaOne-Regular.ttf');
  fontAwesomeIcons = loadFont('src/assets/fonts/font-awesome.otf');
}

const spawnPowerup = () => {
  imageMode(CENTER);

  // If there isn't currently a powerup on screen, spawn one every X points
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
      const x = width / 2;
      const y = height;
      const ball = new Ball(x, y, 50, animationBall, 0.15, hitSound);
      ball.clickEvent(x, y);
      ball.hitCount = 0;
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
  if (resize) {
    resizeCanvas(windowWidth, windowHeight);
    resize = false;
  }

  const ball = new Ball(width / 2, height * (3 / 4), 50, animationBall, 0.15, hitSound);
  ball.frozen = true;

  if (totalScore > sessionBestScore) {
    sessionBestScore = totalScore;
    // writeHighScoreCookie() will check if provided score
    // is greater than currently saved highscore
    // score only written if greater than current high
    writeHighScoreCookie(sessionBestScore);
  }

  totalScore = 0;
  deadBallScore = 0;

  balls.splice(0, balls.length);
  balls.push(ball);
  multiBallPowerup = null;
};

function setup() {
  createCanvas(windowWidth, windowHeight);

  imageMode(CENTER);

  animationBall = readSpriteSheet(spriteSheetBall, spriteDataBall);
  animationStar = readSpriteSheet(spriteSheetStar, spriteDataStar);

  addToHomeScreenBtn = new AddToHomeSceenButton(
    {
      installed: appIsInstalled,
      prompt: confirmInstallPrompt,
      fnt: fontAwesomeIcons,
      fntSize: 30,
    },
  );

  resetGame();
}

function mousePressed() {
  balls.forEach((ball) => ball.clickEvent(mouseX, mouseY));
  if (multiBallPowerup) {
    multiBallPowerup.clickEvent(mouseX, mouseY);
  }
  addToHomeScreenBtn.clickEvent(mouseX, mouseY);
}

function touchStarted() {
  mousePressed();
  return false;
}

function windowResized() {
  if (balls.length === 1 && balls[0].frozen) {
    resizeCanvas(windowWidth, windowHeight);
  } else {
    resize = true;
  }
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

    balls[0].pos.x = width / 2;
    balls[0].pos.y = height * (3 / 4);

    // If never played then readHighScoreCookie() returns -1
    // displayBestScore() only displays if score > 0
    displayBestScore(readHighScoreCookie(), gameFont);

    // Place in bottom right corner
    addToHomeScreenBtn.x = width - addToHomeScreenBtn.width * 1.1;
    addToHomeScreenBtn.y = height - addToHomeScreenBtn.height * 1.1;
    addToHomeScreenBtn.draw();
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

  displayScore(totalScore, gameFont);

  if (balls.length < 1) {
    resetGame();
  }
}

window.mousePressed = mousePressed;
window.touchStarted = touchStarted;
window.windowResized = windowResized;

window.preload = preload;
window.setup = setup;
window.draw = draw;

window.addEventListener('beforeinstallprompt', handleInstallPromptEvent);
