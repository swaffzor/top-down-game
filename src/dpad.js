if (window.innerHeight < window.innerWidth) {
  document.getElementById('dpad').style.display = 'none'
}

const stopMoving = () => {
  keys.w.pressed = false
  keys.s.pressed = false
  keys.a.pressed = false
  keys.d.pressed = false
}

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