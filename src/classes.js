const GRAVITY = 2

class Sprite {
  constructor({ image,
    animationSpeed = 10,
    direction,
    flipHorizontal = false,
    flipVertical = false,
    frames = { max: 1 },
    isAnimating = true,
    name,
    onLoad,
    position,
    scale = 1,
    showBorder = false,
    sprites,
    strokeStyle = 'rgba(255, 0, 0, 0.8)',
    velocity,
    visible = true,
    width,
  }) {
    this.name = name
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
      this.width = width ?? this.image.width / this.frames.max
      this.height = this.image.height
      // console.log(this.image.src, `${this.width}x${this.height}`)
      onLoad && onLoad(this.width, this.height)
    }
    this.moving = false
    this.running = false
    this.jumping = 0
    this.visible = visible
    this.shape = 'rect'
    this.scale = scale
    this.isAnimating = isAnimating
    this.flipVertical = flipVertical
    this.flipHorizontal = flipHorizontal
    this.showBorder = showBorder
    this.strokeStyle = strokeStyle
    this.animationSpeed = animationSpeed
  }

  draw() {
    if (!this.visible) return
    if (this.flipHorizontal || this.flipVertical) context.save()
    if (this.flipHorizontal) {
      context.scale(-1, 1)
      context.translate(-this.position.x * 2 - this.width, 0)
    }
    if (this.flipVertical) {
      context.scale(1, -1)
      context.translate(0, -this.position.y * 2 - this.height)
    }
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

    if (this.flipHorizontal || this.flipVertical) context.restore()


    if (this.showBorder) {
      context.strokeStyle = this.strokeStyle
      context.strokeRect(this.position.x, this.position.y, this.width, this.height)
    }

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

    // context.strokeStyle = 'rgba(255, 0, 0, 0.8)'
    // context.strokeRect(this.position.x, this.position.y, this.width, this.height,)

    // frame/animation management
    const animationSpeed = this.running ? this.animationSpeed / 2 : this.animationSpeed // lower is faster
    if (!this.isAnimating) return
    if (this.frames.max > 1) this.frames.elapsed++
    if (this.frames.elapsed % animationSpeed === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }
  }
}

class Collider {
  static width = 16
  static height = 16
  static isBoundary = true
  constructor({ position,
    width,
    height,
    name,
    fillStyle = 'rgba(255, 0, 0, 0.2)',
    strokeStyle = 'rgba(255, 0, 0, 0.8)',
    shape = 'rect',
    render = 'fill',
    visible = true,
    scale = 1,
    customRender = () => { }
  }) {
    this.position = position
    this.width = width || Collider.width
    this.height = height || Collider.height
    this.fillStyle = fillStyle
    this.shape = shape
    this.velocity = { x: 1, y: 1, z: 0 }
    this.direction = ''
    this.visible = visible
    this.time = 0
    this.angle = 0
    this.name = name
    this.render = render
    this.strokeStyle = strokeStyle
    this.scale = scale
    this.customRender = customRender
  }

  draw() {
    if (!this.visible) return
    context.fillStyle = this.fillStyle
    context.strokeStyle = this.strokeStyle

    if (this.angle > 0) {
      context.save()
      context.translate(this.position.x, this.position.y)
      context.rotate(this.angle)
      if (this.shape === 'rect') {
        context.fillRect(-this.width / 2, -this.height, this.width, this.height)
        // context.strokeRect(0, -this.height, this.width , this.height)
      } else if (this.shape === 'circle') {
        context.beginPath()
        context.arc(0, 0, this.width, 0, 2 * Math.PI)
        context.fill()
        context.stroke()
      }
      context.restore()
    } else if (this.shape === 'rect') {
      context.fillRect(this.position.x, this.position.y, this.width, this.height)
      context.strokeRect(this.position.x, this.position.y, this.width, this.height)
    } else if (this.shape === 'circle') {
      context.beginPath()
      context.arc(this.position.x, this.position.y, this.width, 0, 2 * Math.PI)
      context.fill()
      context.stroke()
    } else if (this.shape === 'custom') {
      this.customRender()
    }
    // draw a border around the boundary
    // context.strokeStyle = 'rgba(255, 0, 0, 0.5)'
    // context.fillStyle = this.position.z > 0 ? 'rgba(0, 255, 255, 0.9)' : 'rgba(0, 0, 255, 0.9)'
    // if (!this.visible) return
    // if (this.shape === 'circle') {
    //   context.strokeStyle = this.strokeStyle
    //   context.beginPath()
    //   context.arc(this.position.x, this.position.y, this.width, 0, 2 * Math.PI)
    //   context.strokeStyle = this.strokeStyle
    //   context.stroke()
    //   context.fillStyle = this.fillStyle
    //   context.fill()
    // } else {
    //   context.fillStyle = this.fillStyle
    //   context.fillRect(this.position.x, this.position.y, this.width, this.height)
    //   context.strokeStyle = this.strokeStyle
    //   context.strokeRect(this.position.x, this.position.y, this.width, this.height)
    // }

  }
}