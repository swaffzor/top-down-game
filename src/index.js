const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

canvas.width = 900 //* 16
canvas.height = 506 //* 9

if (window.innerHeight < window.innerWidth) {
  document.getElementById('dpad').style.display = 'none'
}

const initMapPos = { x: canvas.width / 4, y: canvas.height / 4 }
const map = new Image();
map.src = './sprites/test-map.png'
const background = new Sprite({ image: map, position: initMapPos })
const foreMap = new Image();
foreMap.src = './sprites/test-map-foreground.png'
const foreground = new Sprite({ image: foreMap, position: initMapPos })

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
  image: playerIdleDown,
  position: {
    x: canvas.width / 2 - 32 / 2,
    y: canvas.height / 2 - 32 / 2
  },
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

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 26) {
  collisionsMap.push(collisions.slice(i, i + 26))
}

const boundaries = []
collisionsMap.forEach((row, y) => {
  row.forEach((cell, x) => {
    if (cell > 0) {
      boundaries.push(new Boundary({
        position: {
          x: x * Boundary.width + initMapPos.x,
          y: y * Boundary.height + initMapPos.y,
        }
      }))
    }
  })
})


const movables = [
  background,
  foreground,
  // ...boundaries
]

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

    default:
      break;
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 's':
      keys.s.pressed = false
      break;
    case 'w':
      keys.w.pressed = false
      break;
    case 'a':
      keys.a.pressed = false
      break;
    case 'd':
      keys.d.pressed = false
      break;

    default:
      break;
  }
})

const move = (direction) => {
  switch (direction) {
    case "up":
      keys.w.pressed = true
      break;
    case "down":
      keys.s.pressed = true
      break;
    case "left":
      keys.a.pressed = true
      break;
    case "right":
      keys.d.pressed = true
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
}
let lastKey = ''

const isColliding = (object, collider) => {
  return object.position.x + object.width > collider.position.x &&
    object.position.x < collider.position.x + collider.width &&
    object.position.y + object.height > collider.position.y &&
    object.position.y < collider.position.y + collider.height
}

const STEP = 1
const OFFSET = 0

const isMovePossible = (movable) => {
  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i]
    if (isColliding(movable, boundary)) {
      console.log('colliding')
      // moving = false
      return false
    }
  }
  return true
}

const makePlayerMove = (axis, distance, offset) => {
  const tempPlayer = { ...player, position: { ...player.position, [axis]: player.position[axis] + distance + offset } }

  if (isMovePossible(tempPlayer)) {
    movables.forEach(movable => {
      movable.position[axis] += distance
    })
    boundaries.forEach(boundary => {
      boundary.position[axis] += 2 * distance
    })
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

const animate = () => {
  window.requestAnimationFrame(animate)
  context.fillStyle = "#0099cc" // ocean blue
  context.fillRect(0, 0, canvas.width, canvas.height);
  background.draw()
  debugDraw()
  player.draw()


  foreground.draw()

  player.moving = false

  if (keys.w.pressed && lastKey === 'w') {
    player.direction = 'up'
    player.image = player.sprites.up
    player.moving = true
    makePlayerMove('y', STEP, -OFFSET)
  }
  if (keys.s.pressed && lastKey === 's') {
    player.direction = 'down'
    player.image = player.sprites.down
    player.moving = true
    makePlayerMove('y', -STEP, OFFSET)
  }
  if (keys.a.pressed && lastKey === 'a') {
    player.direction = 'left'
    player.image = player.sprites.left
    player.moving = true
    makePlayerMove('x', STEP, -OFFSET)
  }
  if (keys.d.pressed && lastKey === 'd') {
    player.direction = 'right'
    player.image = player.sprites.right
    player.moving = true
    makePlayerMove('x', -STEP, OFFSET)
  }

  if (!player.moving) {
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
    document.getElementById('player').innerHTML = `x: ${background.position.x}, y: ${background.position.y}`


    // document.getElementById('boundary').innerHTML = `x: ${boundaries[closestBoundary.x].position.x}, y: ${boundaries[closestBoundary.y].position.y}`
  }

}


animate()
