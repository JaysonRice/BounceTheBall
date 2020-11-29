class MultiBall {
    constructor(x, y, radius, animation, animationSpeed, hitSound) {
        // For scoring
        this.ballIsHit = false;
        this.hitCount = 0;

        this.radius = radius;

        // For detecting if edge of ball off screen in X dir
        this.minX = this.radius;
        this.maxX = width - this.radius;

        // Physics (position & velocity)
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();

        // Magic number constant land:
        this.restitution = 0.8;
        this.gravity = createVector(0, 0.35);
        this.speedLimit = 17;

        // Animation (fps)
        this.animation = animation;
        this.animationSpeed = animationSpeed;
        this.frameIndex = 0;

        // Audio for getting powerup
        this.hitSound = hitSound;
    }

    checkHit(x, y) {

        const d = dist(this.pos.x, this.pos.y, x, y);
        const powerupIsHit = d < this.radius && !tooHigh;

        return [powerupIsHit];
    }

    getPower(x, y) {
        let d;

        [this.ballIsHit, d] = this.checkHit(x, y);

        // Exit if missed
        if (!this.ballIsHit) return;

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

}