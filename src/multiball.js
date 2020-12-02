class MultiBallPowerup {
    // TODO: Add animation and sound effect for getting powerup
    constructor(x, y, radius) {
        this.powerupIsHit = false;
        this.radius = radius;

        // Physics (position & velocity)
        this.pos = createVector(x, y);
        this.vel = createVector();

        // Magic number constant land:
        this.restitution = 0.8;
        this.gravity = createVector(0, 0.35);
        this.speedLimit = 17;
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
        this.pos.y = this.pos.y + 3;
    }

}

export default MultiBallPowerup