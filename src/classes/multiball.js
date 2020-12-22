/* eslint-disable import/extensions */
import ClickableObject from './clickableObject.js';

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
    this.pos.y += 3;
  }

  animate() {
    this.frameIndex += this.animationSpeed;
  }
}

export default MultiBallPowerup;
