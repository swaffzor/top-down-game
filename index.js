const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

canvas.width = 900 //* 16
canvas.height = 506 //* 9

context.fillStyle = "#0099cc"
context.fillRect(0, 0, canvas.width, canvas.height);

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
  position: { x: canvas.width / 2, y: canvas.height / 2 },
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

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 's':
      keys.s.pressed = true
      break;
    case 'w':
      keys.w.pressed = true
      break;
    case 'a':
      keys.a.pressed = true
      break;
    case 'd':
      keys.d.pressed = true
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

const animate = () => {
  window.requestAnimationFrame(animate)
  context.fillRect(0, 0, canvas.width, canvas.height);
  background.draw()
  player.draw()
  foreground.draw()

  player.moving = false
  if (keys.w.pressed) {
    player.direction = 'up'
    player.moving = true
    player.image = player.sprites.up
    background.position.y += 1
    foreground.position.y += 1
  }
  if (keys.s.pressed) {
    player.direction = 'down'
    player.moving = true
    player.image = player.sprites.down
    background.position.y -= 1
    foreground.position.y -= 1
  }
  if (keys.a.pressed) {
    player.direction = 'left'
    player.moving = true
    player.image = player.sprites.left
    background.position.x += 1
    foreground.position.x += 1
  }
  if (keys.d.pressed) {
    player.direction = 'right'
    player.moving = true
    player.image = player.sprites.right
    background.position.x -= 1
    foreground.position.x -= 1
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
  }

}

animate()
