
let ball;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ball = new Ball(width / 2, 0, 50);
}

function draw() {
  // background(25);
  ball.update()
  ball.draw()
}

function mouseClicked() {
  ball.clickEvent(mouseX, mouseY)
}

class Ball {
  constructor(x, y, radius) {
    this.pos = createVector(x, y)
    this.vel = createVector()
    this.acc = createVector()
    this.hitVelocity = createVector()
    this.hitMagnitude = 30
    this.radius = radius
    this.gravity = createVector(0, 0.5)
    this.speedLimit = 20
  }

  clickEvent(x, y) {

    if (dist(this.pos.x, this.pos.y, x, y) < this.radius) {
      const angle = atan2(y - this.pos.y, x - this.pos.x)
      this.hitVelocity.y = 0;
      this.hitVelocity.x = -this.hitMagnitude;
      this.hitVelocity.rotate(angle)
      print("hit")
    }
    else print("whoops")
  }

  update() {
    this.vel.add(this.acc)
    this.vel.add(this.hitVelocity)
    this.vel.add(this.gravity)
    this.vel.limit(this.speedLimit)
    this.pos.add(this.vel)
  }

  draw() {
    ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2)
  }




}


window.setup = setup;
window.draw = draw;
