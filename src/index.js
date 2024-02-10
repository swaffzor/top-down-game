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
    x: canvas.width / 2 - 32 / 2,
    y: canvas.height / 2 - 32 / 2,
    z: 0,
  },
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

const ball = new Boundary({
  position: { x: 500, y: 250 },
  width: 3,
  height: 3,
  shape: 'circle',
  fillStyle: 'rgba(255, 255, 255, 1)'
})

const hole = new Sprite({
  image: './sprites/hole.png',
  position: { x: 500, y: 250 },
  frames: { max: 1 },
})

const powerBar = new Boundary({
  position: { x: player.position.x + 16, y: 260 },
  width: 10,
  height: 10,
  shape: 'rect',
  fillStyle: 'rgba(255, 0, 255, 1)'
})

const portalA = new Sprite({
  image: './sprites/portal3.png',
  position: { x: 580, y: 220 },
  frames: { max: 7 },
})

const portalB = new Sprite({
  image: './sprites/portal3.png',
  position: { x: 415, y: 350 },
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
  ball,
  portalA,
  portalB,
  hole,
  ...boundaries
]

const drawables = [
  background,
  portalA,
  portalB,
  ball,
  hole,
  player,
  foreground,
]

let state = {
  animationMode: 'move'
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
      if (isColliding(player, ball) && state.animationMode === 'move') {
        state.animationMode = 'powerBar'
        ball.direction = player.direction
        window.requestAnimationFrame(animatePowerBar)
      } else if (state.animationMode === 'powerBar') {
        state.animationMode = 'move'
        ball.velocity.x = powerBar.width / 100
        ball.velocity.y = powerBar.height / 100
        window.requestAnimationFrame(animateBall)
      }
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
  }
}
let lastKey = ''

const isColliding = (object, collider) => {
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
  } else {
  }
  document.getElementById('player').innerHTML = `player: x: ${background.position.x}, y: ${background.position.y}`
  document.getElementById('background').innerHTML = `ball: x: ${Math.floor(ball.position.x)}, y: ${Math.floor(ball.position.y)}`

  window.requestAnimationFrame(animate)
}

animate()

let barDirection = 'grow'
const animatePowerBar = () => {
  // position the power bar
  if (player.direction === 'up') {
    powerBar.width = 10
    powerBar.position.x = ball.position.x - powerBar.width / 2
    powerBar.position.y = ball.position.y - powerBar.height
  }
  if (player.direction === 'down') {
    powerBar.width = 10
    powerBar.position.x = ball.position.x - powerBar.width / 2
    powerBar.position.y = ball.position.y - ball.height / 2
  }
  if (player.direction === 'left') {
    powerBar.height = 10
    powerBar.position.x = ball.position.x - powerBar.width
    powerBar.position.y = ball.position.y - powerBar.height / 2
  }
  if (player.direction === 'right') {
    powerBar.height = 10
    powerBar.position.x = ball.position.x
    powerBar.position.y = ball.position.y - powerBar.height / 2
  }

  powerBar.draw()
  ball.draw()

  // animate the power bar
  if (barDirection === 'grow') {
    if (player.direction === 'right') {
      if (powerBar.width < 100) powerBar.width += BAR_VELOCITY
      else barDirection = 'shrink'
    }
    if (player.direction === 'down') {
      if (powerBar.height < 100) powerBar.height += BAR_VELOCITY
      else barDirection = 'shrink'
    }
    if (player.direction === 'left') {
      if (powerBar.width < 100) powerBar.width += BAR_VELOCITY
      else barDirection = 'shrink'
    }
    if (player.direction === 'up') {
      if (powerBar.height < 100) powerBar.height += BAR_VELOCITY
      else barDirection = 'shrink'
    }
  }
  else if (barDirection === 'shrink') {
    if (player.direction === 'right') {
      if (powerBar.width > 10) powerBar.width -= BAR_VELOCITY
      else barDirection = 'grow'
    }
    if (player.direction === 'down') {
      if (powerBar.height > 10) powerBar.height -= BAR_VELOCITY
      else barDirection = 'grow'
    }
    if (player.direction === 'left') {
      if (powerBar.width > 10) powerBar.width -= BAR_VELOCITY
      else barDirection = 'grow'
    }
    if (player.direction === 'up') {
      if (powerBar.height > 10) powerBar.height -= BAR_VELOCITY
      else barDirection = 'grow'
    }
  }
  else if (powerBar.width === 100) barDirection = 'shrink'
  else if (powerBar.width === 0) barDirection = 'grow'

  if (state.animationMode === 'powerBar') window.requestAnimationFrame(animatePowerBar)
}

let counter = 0
let isInPortal = false

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

  if (!isInPortal && isColliding(ball, portalA)) {
    isInPortal = true
    ball.position.x = portalB.position.x + portalB.width / 2
    ball.position.y = portalB.position.y + portalB.height / 2
  }
  if (!isInPortal && isColliding(ball, portalB)) {
    isInPortal = true
    ball.position.x = portalA.position.x + ball.velocity.x
    ball.position.y = portalA.position.y + ball.velocity.y
  }

  if (ball.direction === 'up' || ball.direction === 'down') {
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
    if (counter < 20) {
      ball.position.y -= 2 * Math.sin(Math.PI / 4)
    } else if (counter < 39) {
      ball.position.y -= Math.sin(.747)
    } else if (counter < 75) {
      ball.position.y -= Math.sin(-.89) * 3 / 2
    } else if (counter < 100) {
      // no op, straight line, roll on ground

    }
  }

  // idea: hit ball through portals, can use:
  // ball.position.y = counter < 50 ? Math.pow(ball.position.x, 2) / 1000 : Math.pow(ball.position.x, 2) / 1000 + 100

  if (counter < 100) {
    counter++
    window.requestAnimationFrame(animateBall)
  } else {
    counter = 0
    isInPortal = false
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
