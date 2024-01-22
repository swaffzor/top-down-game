class Sprite {
  constructor({ image, position, velocity, frames = { max: 1 }, sprites, direction }) {
    this.image = image
    this.position = position
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.velocity = velocity
    this.sprites = sprites
    this.direction = direction

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.moving = false
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

    // if (!this.moving) return

    if (this.frames.max > 1) this.frames.elapsed++
    if (this.frames.elapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }
  }
}