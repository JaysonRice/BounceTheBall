import ClickableObject from './clickableObject.js';

class MultiBallPowerup {
    // TODO: Add animation and sound effect for getting powerup
    constructor(x, y, radius, animation, animationSpeed, hitSound) {

        // Inherits properties all clickable objects need
        // pos.x/pos.y/radius/animation/animationSpeed/frameIndex/hitSound
        ClickableObject.call(this, x, y, radius, animation, animationSpeed, hitSound)

        this.powerupIsHit = false;
    }

    getPower(x, y) {
        const d = dist(this.pos.x, this.pos.y, x, y);
        this.powerupIsHit = d < this.radius;

        // Exit if missed
        if (!this.powerupIsHit) return;

        // Play sound here
    }

    clickEvent(clickX, clickY) {
        this.getPower(clickX, clickY);
    }

    draw() {
        fill(100, 200);
        ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
    }

    update() {
        this.pos.y = this.pos.y + 4;
    }

}

export default MultiBallPowerup