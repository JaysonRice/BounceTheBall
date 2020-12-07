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

        // Play sound here
    }

    draw() {
        fill(100, 200);
        ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
    }

    update() {
        this.pos.y = this.pos.y + 3;
    }

}

export default MultiBallPowerup