class Sprite {
    constructor(animation, speed) {
        this.animation = animation;
        this.speed = speed;
        this.len = this.animation.length;
        this.index = 0;
    }
    show() {
        let index = floor(this.index) % this.len
        image(this.animation[index], 0, 0);
    }

    animate() {
        this.index += this.speed
    }

}

export default Sprite;