class Ball {
  constructor(x, y, radius) {
    this.radius = radius;

    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.minX = this.radius;
    this.maxX = width - this.radius;

    this.restitution = 0.8

    this.gravity = createVector(0, 0.1);
    this.speedLimit = 20;

    // For applying user input force to ball
    this.hitVelocity = createVector();
    // Magic number, can be adjusted at will until it feels right
    // No f=ma stuff happening, just applied as a veloctiy (in pixels per frame)
    this.hitMagnitude = this.gravity.y * 100;
  }

  clickEvent(x, y) {
    const ballIsHit = dist(this.pos.x, this.pos.y, x, y) < this.radius;

    if (ballIsHit) {
      // Find angle between click position and center of ball
      const angle = atan2(y - this.pos.y, x - this.pos.x);

      // Calc vector to apply force to ball using
      this.hitVelocity.y = 0;
      this.hitVelocity.x = -this.hitMagnitude;
      this.hitVelocity.rotate(angle);
    }

    // TODO: Delete me after debugging
    push();
    fill(255, 0, 0);
    ellipse(x, y, 30, 30);
    pop();
  }

  update() {

    this.wallBounce()
    this.vel.add(this.acc);
    this.vel.add(this.gravity);

    this.vel.add(this.hitVelocity);
    // Reset hit velocity so its only applied once
    this.hitVelocity.mult(0);

    this.vel.limit(this.speedLimit);
    this.pos.add(this.vel);
    this.pos.x = constrain(this.pos.x, this.minX, this.maxX)
  }

  wallBounce() {

    if (this.pos.x >= this.maxX || this.pos.x <= this.minX) {
      this.vel.x *= -this.restitution
    }

  }

  draw() {
    fill(255, 30);
    ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
  }
}

export default Ball;
