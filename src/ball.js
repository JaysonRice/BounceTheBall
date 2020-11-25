import constrainAngle from './helpers/constrainAngle.js';

class Ball {
  constructor(x, y, radius) {
    // For scoring
    this.ballIsHit = false;
    this.hitCount = 0;

    this.radius = radius;

    // For detecting if edge of ball off screen in X dir
    this.minX = this.radius;
    this.maxX = width - this.radius;

    // Physics (position, velocity, acceleration)
    // TODO: acceleration not currently used, delete
    //  from final product if still unused
    this.pos = createVector(x, y);
    this.vel = createVector();

    // Constrain angle to always be hitting the ball up
    // ie angleHit = constrain(angleHit, this.minAngle, this.maxAngle)
    this.minAngle = -PI * 0.65;
    this.maxAngle = -PI * 0.35;

    // Magic number constant land:
    this.restitution = 0.8;
    this.gravity = createVector(0, 0.3);
    this.speedLimit = 17;

    // How hard does the user hit the ball?
    // No f=ma stuff happening, just applied as a veloctiy (in pixels per frame)
    this.hitMagnitude = this.gravity.y * 100;
    // For applying hitMagnitude to ball
    this.hitVelocity = createVector();
  }

  clickEvent(clickX, clickY) {
    const d = dist(this.pos.x, this.pos.y, clickX, clickY);
    this.ballIsHit = d < this.radius;

    // If hit is too high on ball, ignore
    const tooHigh = this.pos.y - clickY > this.radius * 0.8;

    if (this.ballIsHit && !tooHigh) {
      // Find angle between click position and center of ball
      let angle = -atan2(clickY - this.pos.y, clickX - this.pos.x);
      angle = constrainAngle(angle, this.minAngle, this.maxAngle);
      this.hitCount += 1;

      // If hit on ball is near the center, change angle to mostly straight up
      if (d < this.radius / 3) {
        angle = random(-1.6, -1.4);
      }

      // Calc vector to apply force to ball using
      this.hitVelocity.y = 0;
      this.hitVelocity.x = -this.hitMagnitude;
      this.hitVelocity.rotate(-angle);
    }

    // TODO: Delete me after debugging
    push();
    fill(255, 0, 0);
    ellipse(clickX, clickY, 30, 30);
    pop();
  }

  update() {
    this.wallBounce();
    this.vel.add(this.gravity);

    this.vel.add(this.hitVelocity);
    // Reset hit velocity so its only applied once
    this.hitVelocity.mult(0);
    this.ballIsHit = false;

    this.vel.limit(this.speedLimit);
    this.pos.add(this.vel);
    this.pos.x = constrain(this.pos.x, this.minX, this.maxX);
  }

  wallBounce() {
    if (this.pos.x >= this.maxX || this.pos.x <= this.minX) {
      this.vel.x *= -this.restitution;
    }
  }

  draw() {
    push();
    if (this.ballIsHit) {
      fill(0, 0, 255);
    }
    ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
    pop();
  }
}

export default Ball;
