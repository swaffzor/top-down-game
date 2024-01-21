const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

canvas.width = 1024
canvas.height = 576

context.fillStyle = "#0099cc"
context.fillRect(0, 0, canvas.width, canvas.height);

const map = new Image();
map.src = './test-map.png'

const spriteCount = 6
const spriteWidth = 16
const playerImage = new Image();
playerImage.src = './Alex_run_down_16x16.png'

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

const background = new Sprite({ image: map, position: { x: 0, y: 0 }, spriteCount: 1, spriteWidth: 1024 })
const player = new Sprite({ image: playerImage, position: { x: 100, y: 100 }, spriteCount, spriteWidth })

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

const animate = () => {
  window.requestAnimationFrame(animate)
  context.fillRect(0, 0, canvas.width, canvas.height);
  background.draw()
  player.draw()

  if (keys.w.pressed) background.position.y += 1
  if (keys.s.pressed) background.position.y -= 1
  if (keys.a.pressed) background.position.x += 1
  if (keys.d.pressed) background.position.x -= 1

}

animate()
