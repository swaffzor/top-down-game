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

map.onload = () => {
  context.drawImage(map, 0, 0)
  context.drawImage(
    playerImage,
    0,                      // cropping 
    0,                      // cropping 
    playerImage.width / 6,  // cropping
    playerImage.height,     // cropping 
    50,                     // actual
    125,                    // actual
    playerImage.width / 6,  // actual
    playerImage.height,     // actual
  )
}

