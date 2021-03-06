/* eslint-disable import/extensions */
import constrainAngle from '../helpers/constrainAngle.js';
import ClickableObject from './clickableObject.js';

const GRAVITY_60_FPS = 0.35;
const SPEEDLIMIT_60_FPS = 17;

const GRAVITY_30_FPS = 1.3;
const SPEEDLIMIT_30_FPS = 30;

class Ball extends ClickableObject {
  constructor(x, y, radius, animation, animationSpeed, hitSound) {
    // Inherits properties all clickable objects need
    // pos.x/pos.y/radius/animation/animationSpeed/frameIndex/hitSound
    super(x, y, radius, animation, animationSpeed, hitSound);

    // Physics (position & velocity)
    this.vel = createVector();
    this.acc = createVector();

    // For scoring & game state mgmt
    this.ballIsHit = false;
    this.hitCount = 0;
    this.dead = false;
    this.frozen = false;

    // For detecting if edge of ball off screen in X dir
    this.minX = this.radius;
    // this.maxX is defined as a getter below: width - this.radius;

    // Constrain angle to always be hitting the ball up
    // ie angleHit = constrain(angleHit, this.minAngle, this.maxAngle)
    this.minAngle = -PI * 0.65;
    this.maxAngle = -PI * 0.35;

    this.angle = 0;
    this.spinRate = 0;
    this.minSpinRate = -0.1;
    this.maxSpinRate = 0.1;

    // Magic number constant land:
    this.restitution = 0.8;
    this.gravity = createVector(0, GRAVITY_60_FPS);
    this.speedLimit = SPEEDLIMIT_60_FPS;

    // How hard does the user hit the ball?
    this.hitMagnitude = this.gravity.y * 100;
    // For applying hitMagnitude force to ball
    this.hitForce = createVector();
  }

  get maxX() {
    return width - this.radius;
  }

  scalePhysics() {
    const fps = frameRate();
    this.gravity.y = map(fps, 30, 60, GRAVITY_30_FPS, GRAVITY_60_FPS, true);
    this.speedLimit = map(fps, 30, 60, SPEEDLIMIT_30_FPS, SPEEDLIMIT_60_FPS, true);
    this.hitMagnitude = this.gravity.y * 100;
  }

  applyForce(force) {
    // f=ma
    // assume mass of 1 to make math easier (revisit if needed)
    // f=a; when m=1
    this.acc.add(force);
  }

  checkHit(x, y) {
    // If hit is too high on ball, it will be ignored
    const tooHigh = this.pos.y - y > this.radius * 0.8;

    const d = dist(this.pos.x, this.pos.y, x, y);
    const ballIsHit = d < this.radius && !tooHigh;

    // d is being returned for a 'too close to center' check
    return [ballIsHit, d];
  }

  hitAngle(x, y, d) {
    let angle;
    // How much to deviate from straight up when hit too close to center
    const dAngle = 0.1;
    const straightUp = -PI / 2;

    // If hit too close to center: then direct mostly straight up
    if (d < this.radius / 3) {
      angle = random(straightUp - dAngle, straightUp + dAngle);
    } else {
      // Find angle between click position and center of ball
      angle = atan2(this.pos.y - y, this.pos.x - x);
      // Restrict angle to be directed upwards
      angle = constrainAngle(angle, this.minAngle, this.maxAngle);
    }

    return angle;
  }

  hit(x, y) {
    let d;

    [this.ballIsHit, d] = this.checkHit(x, y);

    // Exit if missed
    if (!this.ballIsHit) return;

    this.frozen = false;
    this.hitCount += 1;
    this.hitSound.play();

    const angle = this.hitAngle(x, y, d);

    // Convert angle of hit into a rotation angle
    this.spinRate = map(angle, this.minAngle, this.maxAngle, this.minSpinRate, this.maxSpinRate);

    // Calc vector to apply force to ball using
    this.hitForce.set(this.hitMagnitude, 0);
    this.hitForce.rotate(angle);

    this.applyForce(this.hitForce);
  }

  wallBounce() {
    if (this.pos.x >= this.maxX || this.pos.x <= this.minX) {
      this.vel.x *= -this.restitution;
    }
  }

  checkDeadBall() {
    if (this.pos.y >= windowHeight + 100) {
      this.dead = true;
    }
  }

  update() {
    if (this.frozen) return;
    this.scalePhysics();

    // Bounce off side walls
    this.wallBounce();
    this.angle += this.spinRate;

    // hitForce will have been applied to acc in hitBall if hit occurred
    this.applyForce(this.gravity);

    this.vel.add(this.acc);
    this.vel.limit(this.speedLimit);

    this.pos.add(this.vel);
    this.pos.x = constrain(this.pos.x, this.minX, this.maxX);

    // Reset hit state after ball has been hit
    this.acc.set(0, 0);
    this.ballIsHit = false;

    // After a ball has dropped completely past the bottom, mark it as dead
    this.checkDeadBall();
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);

    noStroke();
    if (this.ballIsHit) {
      fill(100, 200);
    } else {
      fill(30);
    }
    ellipse(0, 0, this.radius * 2, this.radius * 2);

    const frameIndex = floor(this.frameIndex) % this.animation.length;
    image(this.animation[frameIndex], 0, 0, this.radius * 2, this.radius * 2);
    this.animate();

    pop();
  }

  animate() {
    this.frameIndex += this.animationSpeed;
  }
}

export default Ball;
