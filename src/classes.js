const GRAVITY = 2

class Sprite {
  constructor({ image, position, velocity, frames = { max: 1 }, sprites, direction }) {
    this.image = new Image()
    this.image.src = image

    this.direction = direction
    this.position = position
    this.velocity = velocity

    this.sprites = sprites
    this.frames = {
      ...frames,
      val: 0,
      elapsed: 0
    }

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
      console.log(this.image.src, `${this.width}x${this.height}`)
    }
    this.moving = false
    this.running = false
    this.jumping = 0
    this.visible = true
    this.shape = 'rect'
  }

  draw() {
    if (!this.visible) return
    context.drawImage(                    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
      this.image,                         // image source, the spritesheet
      this.frames.val * this.width,       // image start x, selects which sprite to start rendering from the spritesheet
      0,                                  // image start y, constant 0 because we're only using one row of sprites
      this.image.width / this.frames.max, // image source width, divides the spritesheet into equal parts
      this.image.height,                  // image source height, constant because we're only using one row of sprites
      this.position.x,                    // canvas destination x, where to render the sprite on the canvas
      this.position.y,                    // canvas destination y, where to render the sprite on the canvas
      this.image.width / this.frames.max, // canvas destination width, scales the image on the canvas, same scale in this case
      this.image.height,                  // canvas destination height, scales the image on the canvas, same scale in this case
    )

    // jumping
    if (this.jumping > 0) {
      this.velocity.y = 3
      if (this.position.z < 15) {           // jump height
        this.position.y -= this.velocity.y  // change position by velocity each frame
        this.position.z += this.velocity.y  // keep track of current height
      } else {
        this.jumping = -1
      }
    } else if (this.jumping < 0) {                // falling
      if (this.position.z > 0) {                  // check if back on the ground
        this.position.y += this.velocity.y * 1.5  // change position but faster (gravity)
        this.position.z -= this.velocity.y * 1.5  // keep track of current height
      } else {
        this.jumping = 0
        this.velocity.y = 0
      }
    }

    // frame/animation management
    const animationSpeed = this.running ? 5 : 10 // lower is faster
    if (this.frames.max > 1) this.frames.elapsed++
    if (this.frames.elapsed % animationSpeed === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }
  }
}

class Boundary {
  static width = 16
  static height = 16
  static isBoundary = true
  constructor({ position, width, height, fillStyle = 'rgba(255, 0, 0, 0.2)', shape = 'rect' }) {
    this.position = position
    this.width = width || Boundary.width
    this.height = height || Boundary.height
    this.fillStyle = fillStyle
    this.shape = shape
    this.velocity = { x: 1, y: 1, z: 0 }
    this.direction = ''
    this.visible = true
  }

  draw() {
    const temp = this.visible ? 1 : 0
    context.fillStyle = this.fillStyle
    if (this.shape === 'rect') {
      context.fillRect(this.position.x, this.position.y, this.width * temp, this.height)
    } else if (this.shape === 'circle') {
      context.beginPath()
      context.arc(this.position.x, this.position.y, this.width * temp, 0, 2 * Math.PI) // x, y, radius, startAngle, endAngle, counterclockwise
      context.fill()
    }
    // draw a border around the boundary
    context.strokeStyle = 'rgba(255, 0, 0, 0.8)'
    if (this.shape === 'circle') //context.stroke()
      context.strokeRect(this.position.x, this.position.y, this.width * 2, this.height * 2)
    else
      context.strokeRect(this.position.x, this.position.y, this.width, this.height,)
  }
}