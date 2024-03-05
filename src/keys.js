// file deepcode ignore DuplicateIfBody: <please specify a reason of ignoring this>

let scale = 1; // Initial scale
let offsetX = 0; // Initial x-offset
let offsetY = 0; // Initial y-offset

function setView() {
  context.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  console.log('setView', scale, offsetX, offsetY)
}


function zoomOut() {
  const prevScale = scale; // Save the previous scale
  scale /= 1.1; // Decrease the scale factor for zoom out

  // Adjust the offsets
  offsetX -= (1 - prevScale / scale);
  offsetY -= (1 - prevScale / scale);

  setView();
}

function zoomIn() {
  const prevScale = scale; // Save the previous scale
  scale *= 1.1; // Increase the scale factor to zoom in

  // Adjust the offsets
  offsetX += (1 - scale / prevScale);
  offsetY += (1 - scale / prevScale);

  setView();
}


window.addEventListener('keydown', (event) => {
  lastKey = event.key
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
      if (isColliding({ ...player, width: player.width + 10, height: player.height + 5 }, ball) && state.mode === 'move') {
        ballTarget.visible = true
        barDirection = 'grow'
        state.mode = 'rotateBar'
        powerBar.visible = false
        barAngleSpeed = club.barAngleSpeed
        if (player.direction === 'up' && powerBar.direction !== 'up') {
          powerBar.angle = 2 * Math.PI // starting at 2PI to avoid jittering when rotating back to 0
          powerBar.direction = 'up'
          // powerBar.angle = 0
        }
        if (player.direction === 'right' && powerBar.direction !== 'right') {
          powerBar.angle = 2 * Math.PI + Math.PI / 2
          powerBar.direction = 'right'
          // powerBar.angle = Math.PI / 2
        }
        if (player.direction === 'down' && powerBar.direction !== 'down') {
          powerBar.angle = 2 * Math.PI + Math.PI
          powerBar.direction = 'down'
          // powerBar.angle = Math.PI
        }
        if (player.direction === 'left' && powerBar.direction !== 'left') {
          powerBar.angle = 2 * Math.PI + 3 * Math.PI / 2
          powerBar.direction = 'left'
          // powerBar.angle = 3 * Math.PI / 2
        }
        powerBar.height = club.max
        window.requestAnimationFrame(animatePowerBar)
      } else if (state.mode === 'rotateBar') {
        powerBar.visible = true
        barHeightSpeed = club.barHeightSpeed
        state.mode = 'powerBar'
        powerBar.height = 0
      } else if (state.mode === 'powerBar') {
        ballFrames = MAX_BALL_FRAMES * powerBar.height / club.max
        state.strokes++
        // state.portal = ""
        state.mode = 'move'
        state.camera = 'ball'
        window.requestAnimationFrame(animateBall)
      }
      break
    case 'Escape':
      if (state.camera === 'free') {
        window.requestAnimationFrame(animateBackToPlayer)
        state.camera = 'player'
      } else if (state.mode === 'powerBar') {
        powerBar.visible = false
        state.mode = 'rotateBar'
      } else if (state.mode === 'rotateBar') {
        powerBar.visible = true
        state.mode = 'move'
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
    case 'q':
      timeOutValue && clearTimeout(timeOutValue)
      ballTarget.visible = true
      keys.q.pressed = true
      break
    case 'e':
      timeOutValue && clearTimeout(timeOutValue)
      ballTarget.visible = true
      keys.e.pressed = true
      break
    case 'u':
      timeOutValue && clearTimeout(timeOutValue)
      ballTarget.visible = true
      keys.u.pressed = true
      break
    case 'i':
      timeOutValue && clearTimeout(timeOutValue)
      ballTarget.visible = true
      keys.i.pressed = true
      break
    case 'o':
      frame = 0
      window.requestAnimationFrame(animateBall)
      keys.o.pressed = true
      break
    case 'n':
      // club selection
      keys.n.pressed = true
      if (club.name === '1') club.name = '1'
      else if (club.name === 'w') club.name = '9'
      else if (club.name === 'p') club.name = 'w'
      else club.name = (parseInt(club.name) - 1).toString()
      club = { ...club.bag[club.name], bag: { ...club.bag }, max: club.bag[club.name].max }
      powerBar.height = club.max
      barAngleSpeed = club.barAngleSpeed
      barHeightSpeed = club.barHeightSpeed

      // range radius
      radiusTimeout && clearTimeout(radiusTimeout)
      clubRadius.visible = true
      clubRadius.strokeStyle = club.name === 'p' ? 'rgba(0, 255, 0, 0.5)' : club.name === 'w' ? 'rgba:(255, 0, 0, 0.5)' : 'rgba(0, 0, 255, 0.5)'
      clubRadius.width = club.max
      break
    case 'm':
      // club selection
      keys.m.pressed = true
      if (club.name === 'p') club.name = 'p'
      else if (club.name === 'w') club.name = 'p'
      else if (club.name === '9') club.name = 'w'
      else club.name = (parseInt(club.name) + 1).toString()
      club = { ...club.bag[club.name], bag: { ...club.bag }, max: club.bag[club.name].max }
      if (powerBar.height > club.max) powerBar.height = club.max
      barAngleSpeed = club.barAngleSpeed
      barHeightSpeed = club.barHeightSpeed

      // range radius
      radiusTimeout && clearTimeout(radiusTimeout)
      clubRadius.visible = true
      clubRadius.strokeStyle = club.name === 'p' ? 'rgba(0, 255, 0, 0.5)' : club.name === 'w' ? 'rgba:(255, 0, 0, 0.5)' : 'rgba(0, 0, 255, 0.5)'
      clubRadius.width = club.max
      break
    case 'p':
      keys.p.pressed = true
      state.camera = 'free'
      break
    case 'l':
      keys.l.pressed = true
      state.camera = 'free'
      break
    case ";":
      keys.semicolon.pressed = true
      state.camera = 'free'
      break
    case "'":
      keys.apostrophe.pressed = true
      state.camera = 'free'
      break
    case 'c':
      keys.c.pressed = true
      holePointer.visible = true
      break
    case ',':
      zoomOut();
      keys.comma.pressed = true
      break;
    case '.':
      zoomIn();
      keys.period.pressed = true
      break;
    case 'Shift':
      player.running = true
      keys.shift.pressed = true
      break;
    default:
      break;
  }
  console.log('pressed', event.key)
})


const eraseClubRadius = () => {
  radiusTimeout = setTimeout(() => {
    clubRadius.visible = false
    console.log('erased clubRadius')
  }, 3000)
}

const eraseBallTarget = () => {
  if (state.mode !== 'move') return
  timeOutValue = setTimeout(() => {
    ballTarget.visible = false
    console.log('erased ballTarget')
  }, 3000)
}

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
    case 'q':
      keys.q.pressed = false
      eraseBallTarget()
      break
    case 'e':
      keys.e.pressed = false
      eraseBallTarget()
      break
    case 'u':
      keys.u.pressed = false
      eraseBallTarget()
      break
    case 'i':
      keys.i.pressed = false
      eraseBallTarget()
      break
    case 'o':
      keys.o.pressed = false
      break
    case 'n':
      keys.n.pressed = false
      eraseClubRadius()
      break
    case 'm':
      keys.m.pressed = false
      eraseClubRadius()
      break
    case 'p':
      keys.p.pressed = false
      break
    case 'l':
      keys.l.pressed = false
      break
    case ';':
      keys.semicolon.pressed = false
      break
    case "'":
      keys.apostrophe.pressed = false
      break
    case 'c':
      setTimeout(() => {
        holePointer.visible = false
      }, 3000)
      keys.c.pressed = false
      break
    case ',':
      keys.comma.pressed = false
      break;
    case '.':
      keys.period.pressed = false
      break;
    case 'Shift':
      player.running = false
      keys.shift.pressed = false
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
  q: {
    pressed: false,
  },
  e: {
    pressed: false,
  },
  u: {
    pressed: false,
  },
  i: {
    pressed: false,
  },
  o: {
    pressed: false,
  },
  n: {
    pressed: false,
  },
  m: {
    pressed: false,
  },
  p: {
    pressed: false,
  },
  l: {
    pressed: false,
  },
  semicolon: {
    pressed: false,
  },
  apostrophe: {
    pressed: false,
  },
  c: {
    pressed: false,
  },
  comma: {
    pressed: false,
  },
  period: {
    pressed: false,
  },
  shift: {
    pressed: false,
  },
}

