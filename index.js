const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

canvas.width = 1024
canvas.height = 576

context.fillStyle = "#0099cc"
context.fillRect(0, 0, canvas.width, canvas.height);

const map = new Image();
map.src = './test-map.png'

const playerImage = new Image();
playerImage.src = './Alex_run_down_16x16.png'
const spriteCount = 6
const spriteWidth = 16

const drawPlayer = () => {
  context.drawImage(
    playerImage,
    0 * spriteWidth,                    // cropping x (source image)
    0,                                  // cropping y
    playerImage.width / spriteCount,    // cropping width
    playerImage.height,                 // cropping height
    position.x,                                // actual x (destination canvas) 
    position.y,                                // actual y
    playerImage.width / spriteCount,    // actual width
    playerImage.height,                 // actual height
  )
}

map.onload = () => {
  context.drawImage(map, 0, 0)
  drawPlayer()
}

let position = {
  x: 125,
  y: 125
}

window.addEventListener('keydown', (event) => {
  console.log(event.key)
  if (event.key === 's') {
    position.y += 5
    context.drawImage(map, 0, 0)
  }
  if (event.key === 'w') {
    position.y -= 5
    context.drawImage(map, 0, 0)
  }
  if (event.key === 'a') {
    position.x -= 5
    context.drawImage(map, 0, 0)
  }
  if (event.key === 'd') {
    position.x += 5
    context.drawImage(map, 0, 0)
  }
  drawPlayer()
})