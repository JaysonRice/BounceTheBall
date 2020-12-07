function ClickableObject(x, y, radius, animation, animationSpeed, hitSound) {
    this.radius = radius;

    // Physics (position)
    this.pos = createVector(x, y);

    // Animation (fps)
    this.animation = animation;
    this.animationSpeed = animationSpeed;
    this.frameIndex = 0;

    // Audio for clicking object
    this.hitSound = hitSound;
};

export default ClickableObject