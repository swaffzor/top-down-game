const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

canvas.width = 900 //* 16
canvas.height = 506 //* 9

context.fillStyle = "#0099cc"
context.fillRect(0, 0, canvas.width, canvas.height);

const initMapPos = { x: canvas.width / 3 - 104, y: canvas.height / 3 - 104 }
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
  image: playerImageDown,
  position: { x: canvas.width / 2, y: canvas.height / 2 },
  frames: { max: spriteCount },
  sprites: {
    down: playerImageDown,
    up: playerImageUp,
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
    background.position.y += 2
    foreground.position.y += 2
  }
  if (keys.s.pressed) {
    player.direction = 'down'
    player.moving = true
    player.image = player.sprites.down
    background.position.y -= 2
    foreground.position.y -= 2
  }
  if (keys.a.pressed) {
    player.direction = 'left'
    player.moving = true
    player.image = player.sprites.left
    background.position.x += 2
    foreground.position.x += 2
  }
  if (keys.d.pressed) {
    player.direction = 'right'
    player.moving = true
    player.image = player.sprites.right
    background.position.x -= 2
    foreground.position.x -= 2
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
