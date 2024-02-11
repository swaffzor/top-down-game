const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

canvas.width = 900 //* 16
canvas.height = 506 //* 9

if (window.innerHeight < window.innerWidth) {
  document.getElementById('dpad').style.display = 'none'
}

const initMapPos = { x: canvas.width / 4, y: canvas.height / 4 }
const background = new Sprite({ image: './sprites/test-map.png', position: initMapPos })
const foreground = new Sprite({ image: './sprites/test-map-foreground.png', position: initMapPos })

const spriteCount = 6
const spriteWidth = 16
const playerImageDown = new Image();
playerImageDown.src = './sprites/alex/run_down.png'
const playerImageUp = new Image();
playerImageUp.src = './sprites/alex/run_up.png'
const playerImageLeft = new Image();
playerImageLeft.src = './sprites/alex/run_left.png'
const playerImageRight = new Image();
playerImageRight.src = './sprites/alex/run_right.png'

const playerIdleUp = new Image();
playerIdleUp.src = './sprites/alex/idle_up.png'
const playerIdleDown = new Image();
playerIdleDown.src = './sprites/alex/idle_down.png'
const playerIdleLeft = new Image();
playerIdleLeft.src = './sprites/alex/idle_left.png'
const playerIdleRight = new Image();
playerIdleRight.src = './sprites/alex/idle_right.png'

const player = new Sprite({
  image: './sprites/alex/idle_down.png',
  position: {
    x: 485,//canvas.width / 2 - 32 / 2,
    y: 232,//canvas.height / 2 - 32 / 2,
    z: 0,
  },
  direction: 'down',
  velocity: { x: 0, y: 0 },
  frames: { max: spriteCount },
  sprites: {
    up: playerImageUp,
    down: playerImageDown,
    left: playerImageLeft,
    right: playerImageRight,
    idleUp: playerIdleUp,
    idleDown: playerIdleDown,
    idleLeft: playerIdleLeft,
    idleRight: playerIdleRight,
  },
})

const club = {
  position: { x: player.position.x + 16, y: player.position.y },
  power: 200
}

const ball = new Boundary({
  position: { x: 500, y: 250, z: 0 },
  width: 3,
  height: 3,
  shape: 'circle',
  fillStyle: 'rgba(255, 255, 255, 1)'
})

const ballShadow = new Boundary({
  position: { x: ball.position.x, y: ball.position.y + 3 },
  width: 3,
  height: 3,
  shape: 'circle',
  fillStyle: 'rgba(0, 0, 0, 0.25)'
})

const hole = new Sprite({
  image: './sprites/hole.png',
  position: { x: 310, y: 225 },
  frames: { max: 1 },
})

const holeWidth = 8
const holeHeight = 6
const holeBoundary = new Boundary({
  position: { x: hole.position.x + 4, y: hole.position.y + 2 },
  width: holeWidth,
  height: holeHeight,
  shape: 'rect',
  fillStyle: 'rgba(255, 0, 0, 0)'
})

const powerBar = new Boundary({
  position: { x: player.position.x + 16, y: 260 },
  width: 10,
  height: 10,
  shape: 'rect',
  fillStyle: 'rgba(255, 0, 255, 0.5)'
})

const portalA = new Sprite({
  image: './sprites/portal3.png',
  position: { x: 570, y: 220 },
  frames: { max: 7 },
})

const portalB = new Sprite({
  image: './sprites/portal3.png',
  position: { x: 262, y: 200 },
  frames: { max: 7 },
})

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 26) {
  collisionsMap.push(collisions.slice(i, i + 26))
}

const boundaries = []
collisionsMap.forEach((row, y) => {
  row.forEach((cell, x) => {
    if (cell === 152) {
      boundaries.push(new Boundary({
        position: {
          x: x * Boundary.width + initMapPos.x,
          y: y * Boundary.height + initMapPos.y,
        }
      }))
    }
  })
})


const grounds = [background, foreground]

const movables = [
  ballShadow,
  ball,
  portalA,
  portalB,
  hole,
  holeBoundary,
  ...boundaries
]

const drawables = [
  background,
  portalA,
  portalB,
  hole,
  ballShadow,
  ball,
  player,
  foreground,
  holeBoundary,
]

let state = {
  animationMode: 'move',
  par: 3,
  strokes: 0,
}

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break;
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break;
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break;
    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break;
    case 'j':
      keys.j.pressed = true
      player.jumping = 1
      break;
    case 'k':
      keys.k.pressed = true
      player.running = true
      break
    case 'Enter':
      keys.enter.pressed = true
      if (isColliding({ ...player, width: player.width + 10, height: player.height + 5 }, ball) && state.animationMode === 'move') {
        state.animationMode = 'powerBar'
        ball.direction = player.direction
        window.requestAnimationFrame(animatePowerBar)
      } else if (state.animationMode === 'powerBar') {
        state.animationMode = 'rotateBar'
        ball.velocity.x = powerBar.width / 100
        // ball.velocity.x = club.power * .52 / 100 // temporary testing
        ball.velocity.y = powerBar.height / 100
      } else if (state.animationMode === 'rotateBar') {
        state.animationMode = 'move'
        state.strokes++
        window.requestAnimationFrame(animateBall)
      }
      break
    case 'Escape':
      if (state.animationMode === 'powerBar') {
        state.animationMode = 'move'
      } else if (state.animationMode === 'rotateBar') {
        state.animationMode = 'powerBar'
      }
      break
    case 't':
      keys.t.pressed = true
      break
    case 'g':
      keys.g.pressed = true
      break
    case 'f':
      keys.f.pressed = true
      break
    case 'h':
      keys.h.pressed = true
      break

    default:
      break;
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 's':
      keys.s.pressed = false
      player.moving = false
      break;
    case 'w':
      keys.w.pressed = false
      player.moving = false
      break;
    case 'a':
      keys.a.pressed = false
      player.moving = false
      break;
    case 'd':
      keys.d.pressed = false
      player.moving = false
      break;
    case 'j':
      keys.j.pressed = false
      player.moving = false
      break;
    case 'k':
      keys.k.pressed = false
      player.running = false
      break
    case 'Enter':
      keys.enter.pressed = false
      break
    case 't':
      keys.t.pressed = false
      break
    case 'g':
      keys.g.pressed = false
      break
    case 'f':
      keys.f.pressed = false
      break
    case 'h':
      keys.h.pressed = false
      break

    default:
      break;
  }
})

const move = (direction) => {
  switch (direction) {
    case "up":
      keys.w.pressed = true
      lastKey = 'w'
      break;
    case "down":
      keys.s.pressed = true
      lastKey = 's'
      break;
    case "left":
      keys.a.pressed = true
      lastKey = 'a'
      break;
    case "right":
      keys.d.pressed = true
      lastKey = 'd'
      break;
  }
}

const stopMoving = () => {
  keys.w.pressed = false
  keys.s.pressed = false
  keys.a.pressed = false
  keys.d.pressed = false
}

const buttonUp = document.getElementById('button-up')
const buttonDown = document.getElementById('button-down')
const buttonLeft = document.getElementById('button-left')
const buttonRight = document.getElementById('button-right')
buttonUp.addEventListener('touchstart', () => move('up'))
buttonUp.addEventListener('touchend', stopMoving)
buttonDown.addEventListener('touchstart', () => move('down'))
buttonDown.addEventListener('touchend', stopMoving)
buttonLeft.addEventListener('touchstart', () => move('left'))
buttonLeft.addEventListener('touchend', stopMoving)
buttonRight.addEventListener('touchstart', () => move('right'))
buttonRight.addEventListener('touchend', stopMoving)

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  j: {
    pressed: false,
  },
  k: {
    pressed: false,
  },
  enter: {
    pressed: false,
  },
  t: {
    pressed: false,
  },
  g: {
    pressed: false,
  },
  h: {
    pressed: false,
  },
  f: {
    pressed: false,
  },
}
let lastKey = ''

const isColliding = (object, collider) => {
  if (object.shape === 'circle' && collider.shape === 'circle') {
    const dx = object.position.x - collider.position.x
    const dy = object.position.y - collider.position.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < object.width + collider.width
  }

  if (object.shape === 'circle' && collider.shape === 'rect') {
    // return true if object is intersecting more than 50% of it's size
    const objectWidth = object.width / 2
    const objectHeight = object.height / 4
    const colliderWidth = collider.width
    const colliderHeight = collider.height
    return object.position.x + objectWidth > collider.position.x &&
      object.position.x < collider.position.x + colliderWidth &&
      object.position.y + objectHeight > collider.position.y &&
      object.position.y < collider.position.y + colliderHeight
  }

  return object.position.x + object.width > collider.position.x &&
    object.position.x < collider.position.x + collider.width &&
    object.position.y + object.height > collider.position.y &&
    object.position.y < collider.position.y + collider.height
}

const isMovePossible = (movable) => {
  if (state.animationMode !== 'move') return false
  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i]
    if (isColliding(movable, boundary)) {
      console.log('colliding')
      moving = false
      return false
    }
  }
  return true
}

const makePlayerMove = (direction) => {
  if (state.animationMode !== "powerBar") player.direction = direction
  player.image = player.sprites[direction]

  const axis = direction === 'up' || direction === 'down' ? 'y' : 'x'
  const polarity = direction === 'up' || direction === 'left' ? 1 : -1

  const movingDistance = polarity * (player.running ? RUN : STEP)
  const movingOffset = -1 * polarity * (player.running ? OFFSET * RUN : OFFSET)
  const tempPlayer = { ...player, position: { ...player.position, [axis]: player.position[axis] + movingDistance + movingOffset } }

  if (isMovePossible(tempPlayer)) {
    player.moving = true
    grounds.forEach(movable => {
      movable.position[axis] += movingDistance
    })
    movables.forEach(boundary => {
      boundary.position[axis] += 2 * movingDistance
    })
    // ball.position[axis] += 2 * movingDistance
  }
}

const debugDraw = () => {
  boundaries.forEach(boundary => {
    context.fillStyle = 'rgba(255, 0, 0, 0.2)'
    context.fillRect(boundary.position.x, boundary.position.y, boundary.width, boundary.height)
  })

  // give the player 1 pixel wide stripes as a measure of distance
  context.fillStyle = 'rgba(0, 0, 255, 0.2)'
  context.fillRect(player.position.x, player.position.y, player.width, player.height)
  context.fillStyle = 'rgba(0, 255, 0, 0.2)'
  context.fillRect(player.position.x, player.position.y, 1, player.height)
  context.fillStyle = 'rgba(0, 0, 255, 0.2)'
  context.fillRect(player.position.x + 1, player.position.y, 1, player.height)
  context.fillStyle = 'rgba(0, 255, 0, 0.2)'
  context.fillRect(player.position.x + 2, player.position.y, 1, player.height)
  context.fillStyle = 'rgba(0, 0, 255, 0.2)'
  context.fillRect(player.position.x + 3, player.position.y, 1, player.height)
  context.fillStyle = 'rgba(0, 255, 0, 0.2)'
  context.fillRect(player.position.x + 4, player.position.y, 1, player.height)
  context.fillStyle = 'rgba(0, 0, 255, 0.2)'
  context.fillRect(player.position.x + 5, player.position.y, 1, player.height)
}

const draw = () => {
  context.fillStyle = "#0099cc" // ocean blue
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawables.forEach(drawable => drawable.draw())

  // debugDraw()
}

const STEP = 1
const RUN = 2
const OFFSET = 3
const BAR_VELOCITY = 3
let barDirection = 'grow'
let barAngle = 0
let barSpeed = 0.02

const animate = () => {
  draw()

  if (keys.w.pressed && lastKey === 'w') {
    makePlayerMove('up')
  }
  if (keys.s.pressed && lastKey === 's') {
    makePlayerMove('down')
  }
  if (keys.a.pressed && lastKey === 'a') {
    makePlayerMove('left')
  }
  if (keys.d.pressed && lastKey === 'd') {
    makePlayerMove('right')
  }

  if (keys.t.pressed) {
    ball.position.y -= keys.k.pressed ? 2 : 1
  }
  if (keys.g.pressed) {
    ball.position.y += keys.k.pressed ? 2 : 1
  }
  if (keys.f.pressed) {
    ball.position.x -= keys.k.pressed ? 2 : 1
  }
  if (keys.h.pressed) {
    ball.position.x += keys.k.pressed ? 2 : 1
  }

  if (isColliding(ball, holeBoundary)) {
    ball.visible = false
    ballShadow.visible = false
    if (ball.velocity.x < 2) ball.velocity.x = 0
    if (ball.velocity.y < 2) ball.velocity.y = 0
    console.log('ball in hole')
    document.getElementById('banner').classList.add('show')
    document.getElementById('banner').innerHTML = state.strokes === 1 ? "HOLE IN ONE!!!" : state.par - state.strokes === 0 ? 'Par!' : state.par - state.strokes === 1 ? 'Birdie!' : state.par - state.strokes === 2 ? 'Eagle!' : state.par - state.strokes === 3 ? 'Albatross!' : state.strokes - state.par
  } else {
    ball.visible = true
  }

  if (!player.moving && !player.jumping) {
    switch (player.direction) {
      case "up":
        player.image = player.sprites.idleUp
        break;
      case "down":
        player.image = player.sprites.idleDown
        break;
      case "left":
        player.image = player.sprites.idleLeft
        break;
      case "right":
        player.image = player.sprites.idleRight
        break;
      default:
        break;
    }
  }

  if (isColliding(ball, portalA) || isColliding(ball, portalB)) {
    if (ball.direction === 'right') ball.position.x++
    if (ball.direction === 'left') ball.position.x--
    if (ball.direction === 'up') ball.position.y--
    if (ball.direction === 'down') ball.position.y++
    console.log('adjusting ball')
    ballShadow.position = { ...ball.position, y: ball.position.y + 3 }
  }

  document.getElementById('stat1').innerHTML = `Par ${state.par} | Strokes ${state.strokes}`
  document.getElementById('stat2').innerHTML = `ball: x: ${Math.floor(ball.position.x)}, y: ${Math.floor(ball.position.y)} z: ${Math.floor(ball.position.z)}`
  document.getElementById('stat3').innerHTML = `powerBar: angle: ${(barAngle / Math.PI).toFixed(2)}`

  window.requestAnimationFrame(animate)
}

animate()



const animatePowerBar = () => {

  if (state.animationMode === 'powerBar') {
    powerBar.draw()
    // position the power bar
    if (player.direction === 'up') {
      powerBar.width = 10
      powerBar.position.x = ball.position.x - powerBar.width / 2
      powerBar.position.y = ball.position.y - powerBar.height
      barAngle = Math.PI
    }
    if (player.direction === 'down') {
      powerBar.width = 10
      powerBar.position.x = ball.position.x - powerBar.width / 2
      powerBar.position.y = ball.position.y - ball.height / 2
      barAngle = 0
    }
    if (player.direction === 'left') {
      powerBar.height = 10
      powerBar.position.x = ball.position.x - powerBar.width
      powerBar.position.y = ball.position.y - powerBar.height / 2
      barAngle = Math.PI
    }
    if (player.direction === 'right') {
      powerBar.height = 10
      powerBar.position.x = ball.position.x
      powerBar.position.y = ball.position.y - powerBar.height / 2
      barAngle = 0
    }

    const dimension = player.direction === 'up' || player.direction === 'down' ? 'height' : 'width'
    // animate the power bar
    if (barDirection === 'grow') {
      if (powerBar[dimension] < club.power) powerBar[dimension] += BAR_VELOCITY
      else barDirection = 'shrink'
    } else if (barDirection === 'shrink') {
      if (powerBar[dimension] > 10) powerBar[dimension] -= BAR_VELOCITY
      else barDirection = 'grow'
    }
    if (powerBar.width === club.power) barDirection = 'shrink'
    else if (powerBar.width === 0) barDirection = 'grow'
  }

  if (state.animationMode === 'rotateBar') {
    console.log('rotating bar')
    context.save(); // Save the unrotated context

    if (["down", "right"].includes(player.direction)) {
      context.translate(ball.position.x - ball.width / 4, ball.position.y + ball.height / 4); // Move the rotation point to the center of the ball
    } else {
      context.translate(ball.position.x + 9 / 2.1, ball.position.y - 9 / 2); // Move the rotation point to the center of the ball
    }

    // Ensure rotation lies within a given range
    barAngle += barSpeed
    if (player.direction === 'right' || player.direction === 'down') {
      if (barAngle > 1 * Math.PI / 4) {
        barSpeed = -barSpeed;
        // file deepcode ignore DuplicateIfBody: <please specify a reason of ignoring this>
      }
      if (barAngle < -1 * Math.PI / 4) {
        barSpeed = -barSpeed;
      }
    }
    if (player.direction === 'left' || player.direction === 'up') {
      if (barAngle < 3 * Math.PI / 4) {
        barSpeed = -barSpeed;
      }
      if (barAngle > 5 * Math.PI / 4) {
        barSpeed = -barSpeed;
      }
    }

    context.rotate(barAngle); // Rotate the canvas by the desired angle
    context.fillStyle = powerBar.fillStyle;
    // powerBar.draw()
    context.fillRect(0, -ball.height * 2, powerBar.width, powerBar.height);
    context.restore(); // Restore the context back to no rotation
  }

  if (state.animationMode !== 'move') window.requestAnimationFrame(animatePowerBar)
  else if (state.animationMode === 'move') {
    // context.restore(); // Restore the context back to no rotation
    // Reset current transformation matrix to the identity matrix
    context.setTransform(1, 0, 0, 1, 0, 0);
  }
  ball.draw()
}

let counter = 0
let ballHasPortaled = false

const animateBall = () => {
  ball.draw()

  if (ball.direction === 'up') {
    ball.position.y -= ball.velocity.y
  }
  if (ball.direction === 'down') {
    ball.position.y += ball.velocity.y
  }
  if (ball.direction === 'left') {
    ball.position.x -= ball.velocity.x
  }
  if (ball.direction === 'right') {
    ball.position.x += ball.velocity.x
  }

  if (!ballHasPortaled && isColliding(ball, portalA)) {
    ballHasPortaled = true
    const dx = Math.abs(portalA.position.x - ball.position.x)
    const dy = Math.abs(portalA.position.y - ball.position.y)
    ball.position.x = portalB.position.x + dx
    ball.position.y = portalB.position.y + dy
  }
  if (!ballHasPortaled && isColliding(ball, portalB)) {
    ballHasPortaled = true
    const dx = Math.abs(portalB.position.x - ball.position.x)
    const dy = Math.abs(portalB.position.y - ball.position.y)
    ball.position.x = portalA.position.x + dx
    ball.position.y = portalA.position.y + dy
  }

  if (ball.direction === 'up' || ball.direction === 'down') {
    ballShadow.position.x = ball.position.x
    ballShadow.position.y = ball.position.y + 3
    if (counter === 20) {
      ball.width += 1
    }
    if (counter === 40) {
      ball.width += 1
    }
    if (counter === 60) {
      ball.width -= 1
    }
    if (counter === 80) {
      ball.width -= 1
    }
  }

  if (ball.direction === 'left' || ball.direction === 'right') {
    ball.position.y -= ball.velocity.y
    // have the ball shadow follow the ball
    ballShadow.position.x = ball.position.x
    if (ball.position.z === 0) ballShadow.position.y = ball.position.y + 3

    const dy = Math.abs(ballShadow.position.y - 3 - ball.position.y)
    ballShadow.position.y -= dy / (101 - counter)
    if (counter < 20) {
      ball.position.y -= 2 * Math.sin(Math.PI / 4)
      ball.position.z += 1
      // ballShadow.position.y += 1
    } else if (counter < 50) {
      ball.position.y -= Math.sin(.747)
      ball.position.z += 1
      // ballShadow.position.y += 1
      // const dy = Math.abs(ballShadow.position.y - 3 - ball.position.y)
      // ballShadow.position.y += dy / (101 - counter)
    } else if (counter < 75) {
      ball.position.z -= 1
      ball.position.y -= Math.sin(-.89) * 3 / 2
      // const dy = Math.abs(ballShadow.position.y - 3 - ball.position.y)
      // ballShadow.position.y -= dy / (101 - counter)
    } else if (counter <= 100) {

    }
  }

  // idea: hit ball through portals, can use:
  // ball.position.y = counter < 50 ? Math.pow(ball.position.x, 2) / 1000 : Math.pow(ball.position.x, 2) / 1000 + 100

  if (counter < 100) {
    counter++
    window.requestAnimationFrame(animateBall)
  } else {
    counter = 0
    ballHasPortaled = false
  }
}

canvas.addEventListener('click', function (event) {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  console.log(`Click. X: ${x} Y: ${y}`);
  // Loop through boundaries and check if click matches a boundary
  // boundaries.forEach((boundary) => {
  //   if (x >= boundary.position.x && x <= boundary.position.x + boundary.width &&
  //     y >= boundary.position.y && y <= boundary.position.y + boundary.height) {
  //     // Log the boundary's details
  //     console.log(`Boundary clicked. X: ${boundary.position.x} Y: ${boundary.position.y}`);
  //   }
  // });
}, false);
