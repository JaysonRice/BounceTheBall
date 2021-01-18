/* eslint-disable import/extensions */
import ClickableObject from './clickableObject.js';

const GRAVITY_60_FPS = 3;
const GRAVITY_30_FPS = 6;

class MultiBallPowerup extends ClickableObject {
  // TODO: Add animation and sound effect for getting powerup
  constructor(x, y, radius, animation, animationSpeed, hitSound) {
    // Inherits properties all clickable objects need
    // pos.x/pos.y/radius/animation/animationSpeed/frameIndex/hitSound
    super(x, y, radius, animation, animationSpeed, hitSound);

    this.powerupIsHit = false;
  }

  hit(x, y) {
    const d = dist(this.pos.x, this.pos.y, x, y);
    this.powerupIsHit = d < this.radius;

    // Exit if missed
    if (!this.powerupIsHit) return;

    // Audio for clicking powerup
    this.hitSound.play();
  }

  draw() {
    push();
    fill(100, 200);

    translate(this.pos.x, this.pos.y);

    const frameIndex = floor(this.frameIndex) % this.animation.length;
    image(this.animation[frameIndex], 0, 0, this.radius * 2, this.radius * 2);
    this.animate();
    pop();
  }

  update() {
    this.pos.y += map(frameRate(), 30, 60, GRAVITY_30_FPS, GRAVITY_60_FPS, true);
  }

  animate() {
    this.frameIndex += this.animationSpeed;
  }
}

export default MultiBallPowerup;
