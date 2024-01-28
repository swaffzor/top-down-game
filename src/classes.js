const GRAVITY = 2

class Sprite {
  constructor({ image, position, velocity, frames = { max: 1 }, sprites, direction }) {
    this.image = image
    this.position = position,
      this.frames = { ...frames, val: 0, elapsed: 0 }
    this.velocity = velocity
    this.sprites = sprites
    this.direction = direction

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.moving = false
    this.running = false
    this.jumping = 0
  }

  draw() {
    context.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height,
    )

    if (this.jumping > 0) {
      this.velocity.y = 3
      if (this.position.z < 15) {
        this.position.y -= this.velocity.y
        this.position.z += this.velocity.y
      } else {
        this.jumping = -1
      }
    } else if (this.jumping < 0) { // falling
      if (this.position.z > 0) {
        this.position.y += this.velocity.y * 1.5
        this.position.z -= this.velocity.y * 1.5
      } else {
        this.jumping = 0
        this.velocity.y = 0
      }
    }

    const frameFactor = this.running ? 5 : 10
    if (this.frames.max > 1) this.frames.elapsed++
    if (this.frames.elapsed % frameFactor === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }
  }
}

class Boundary {
  static width = 16
  static height = 16
  static isBoundary = true
  constructor({ position }) {
    this.position = position
    this.width = 16
    this.height = 16
  }

  draw() {
    context.fillStyle = 'rgba(255, 0, 0, 0.2)'
    context.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}