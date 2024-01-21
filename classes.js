class Sprite {
  constructor({ image, position, velocity, spriteCount, spriteWidth }) {
    this.image = image
    this.position = position
    this.velocity = velocity
    this.spriteCount = spriteCount
    this.spriteWidth = spriteWidth
  }

  draw() {
    context.drawImage(
      this.image,
      0 * this.spriteWidth,
      0,
      this.image.width / this.spriteCount,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.spriteCount,
      this.image.height,
    )
  }
}