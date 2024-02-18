const draw = () => {
  context.fillStyle = "#0099cc" // ocean blue
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawables.forEach(drawable => drawable.draw())

  // debugDraw()
}
const animate = () => {
  draw()

  if (keys.w.pressed) {
    makePlayerMove('up')
  }
  if (keys.s.pressed) {
    makePlayerMove('down')
  }
  if (keys.a.pressed) {
    makePlayerMove('left')
  }
  if (keys.d.pressed) {
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
  // laser pointer controls
  if (keys.q.pressed) {
    powerBar.rotation += .05
    ballTarget.position.x = getDistanceX(powerBar)
    ballTarget.position.y = getDistanceY(powerBar)
  }
  if (keys.e.pressed) {
    powerBar.rotation -= .05
    ballTarget.position.x = getDistanceX(powerBar)
    ballTarget.position.y = getDistanceY(powerBar)
  }
  if (keys.u.pressed) {
    if (powerBar.height < club.max) powerBar.height += barHeightSpeed
    ballTarget.position.x = getDistanceX(powerBar)
    ballTarget.position.y = getDistanceY(powerBar)
  }
  if (keys.i.pressed) {
    if (powerBar.height > 0) powerBar.height -= barHeightSpeed
    ballTarget.position.x = getDistanceX(powerBar)
    ballTarget.position.y = getDistanceY(powerBar)
  }
  // move "camera"
  if (keys.p.pressed) {
    setMoveEverything()
    movables.forEach(movable => {
      movable.position.y += 1 * movable.scale
    })
  }
  if (keys.l.pressed) {
    setMoveEverything()
    movables.forEach(movable => {
      movable.position.x += 1 * movable.scale
    })
  }
  if (keys.semicolon.pressed) {
    setMoveEverything()
    movables.forEach(movable => {
      movable.position.y -= 1 * movable.scale
    })
  }
  if (keys.apostrophe.pressed) {
    setMoveEverything()
    movables.forEach(movable => {
      movable.position.x -= 1 * movable.scale
    })
  }
  if (!keys.p.pressed && !keys.l.pressed && !keys.semicolon.pressed && !keys.apostrophe.pressed && (lastKey === 'p' || lastKey === 'l' || lastKey === ';' || lastKey === "'")) {
    console.log('camera mode off')
    state.mode = 'move'
    movables = [player, powerBar, clubRadius]
  }

  if (isColliding(ball, hole)) {
    console.log('ball in hole')
    ball.visible = false
    ballShadow.visible = false
    ball.position.x = hole.position.x
    ball.position.y = hole.position.y
    document.getElementById('banner').classList.add('show')
    document.getElementById('banner').innerHTML = `${state.strokes === 1
      ? "HOLE IN ONE!!!"
      : state.par - state.strokes === 0
        ? 'Par!'
        : state.par - state.strokes === 1
          ? 'Birdie!'
          : state.par - state.strokes === 2
            ? 'Eagle!'
            : state.par - state.strokes === 3
              ? 'Albatross!'
              : `${(state.par < state.strokes ? '+' : '')} ${(state.strokes - state.par)}`
      }`
  } else {
    // ball.visible = true // todo: all ball to bounce out of hole if the physics are right
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

  // if (isColliding(ball, portalA) || isColliding(ball, portalB)) {
  //   if (ball.direction === 'right') ball.position.x++
  //   if (ball.direction === 'left') ball.position.x--
  //   if (ball.direction === 'up') ball.position.y--
  //   if (ball.direction === 'down') ball.position.y++
  //   console.log('adjusting ball')
  //   ballShadow.position = { ...ball.position, y: ball.position.y + 3 }
  // }

  document.getElementById('stat1').innerHTML = `<strong> Par ${state.par} | Strokes ${state.strokes}</strong > `
  document.getElementById('stat2').innerHTML = `<strong> Club: ${parseInt(club.name) ? club.name + ' Iron' : club.name === 'w' ? 'Wedge' : 'Putter'}</strong > <br /> Ball: x: ${Math.floor(ball.position.x)}, y: ${Math.floor(ball.position.y)} z: ${Math.floor(ball.position.z)}, w: ${Math.floor(ball.width)} `
  document.getElementById('stat3').innerHTML = `<pre> ${JSON.stringify({ club: { name: club.name, max: club.max, loft: club.loft }, ...{ powerBar }, frame, ballFrames, ...{ state }, }, null, 2)}</pre > `

  window.requestAnimationFrame(animate)
}


let tempshit = 0
const tempAnimate = () => {
  switch (tempshit) {
    case 0:
      ball.fillStyle = 'rgba(255, 0, 255, 1)'
      break;
    case 1:
      ball.fillStyle = 'rgba(255, 0, 255, 0.75)'
      ballTarget.fillStyle = 'rgba(255, 0, 0, 1)'
      break;
    case 2:
      ball.fillStyle = 'rgba(255, 0, 255, 0.5)'
      ballTarget.fillStyle = 'rgba(255, 0, 0, 0.75)'
      break;
    case 3:
      ball.fillStyle = 'rgba(255, 0, 255, 0.25)'
      ballTarget.fillStyle = 'rgba(255, 0, 0, 0.5)'
      break;
    case 4:
      ball.fillStyle = 'rgba(255, 0, 255, 0)'
      ballTarget.fillStyle = 'rgba(255, 0, 0, 0.25)'
      break;
    case 5:
      ball.fillStyle = 'rgba(255, 0, 255, 0)'
      ball.position.x = portalA.position.x + portalA.width - ball.position.x + getDistanceX(portalB, frame / ballFrames)
      ball.position.y = portalA.position.y + portalA.height - ball.position.y + getDistanceY(portalB, frame / ballFrames)
      break
    // file deepcode ignore DuplicateCaseBody: <please specify a reason of ignoring this>
    case 6:
      ball.fillStyle = 'rgba(255, 0, 255, 0.25)'
      break;
    case 7:
      ball.fillStyle = 'rgba(255, 0, 255, 0.5)'
      ballTarget.fillStyle = 'rgba(255, 0, 0, 0.25)'
      break;
    case 8:
      ball.fillStyle = 'rgba(255, 0, 255, 0.75)'
      ballTarget.fillStyle = 'rgba(255, 0, 0, .5)'
      break;
    case 9:
      ball.fillStyle = 'rgba(255, 0, 255, 1)'
      ballTarget.fillStyle = 'rgba(255, 0, 0, .75)'
      break;
    case 10:
      ball.fillStyle = 'rgba(255, 255, 255, 1)'
      ballTarget.fillStyle = 'rgba(255, 0, 0, 1)'
      window.requestAnimationFrame(animateBall)
      break;
    default:
      break;
  }
  tempshit++
  if (tempshit <= 11) window.requestAnimationFrame(tempAnimate)
}

const animatePowerBar = () => {
  if (state.mode === 'powerBar') {
    // determine power of swing
    if (barDirection === 'grow') {
      if (powerBar.height < club.max) powerBar.height += barHeightSpeed
      else barDirection = 'shrink'
    } else if (barDirection === 'shrink') {
      if (powerBar.height > 10) powerBar.height -= barHeightSpeed
      else barDirection = 'grow'
    }
    if (powerBar.height === club.max) barDirection = 'shrink'
    else if (powerBar.height === 0) barDirection = 'grow'
  }

  if (state.mode === 'rotateBar') {
    // console.log('rotating bar')
    powerBar.rotation += barAngleSpeed
    if (player.direction === 'down') {
      if (powerBar.rotation < 3 * Math.PI + 1 * Math.PI / 4) {
        barAngleSpeed = -barAngleSpeed;
      }
      if (powerBar.rotation > 3 * Math.PI - 1 * Math.PI / 4) {
        barAngleSpeed = -barAngleSpeed;
      }
    }
    if (player.direction === 'right') {
      if (powerBar.rotation < 2 * Math.PI + Math.PI / 2 + Math.PI / 4) {
        barAngleSpeed = -barAngleSpeed;
      }
      if (powerBar.rotation > 2 * Math.PI + Math.PI / 2 - Math.PI / 4) {
        barAngleSpeed = -barAngleSpeed;
      }
    }
    if (player.direction === 'up') {
      if (powerBar.rotation < 7 * Math.PI / 4) {
        barAngleSpeed = -barAngleSpeed;
      }
      if (powerBar.rotation > 2 * Math.PI + 1 * Math.PI / 4) {
        barAngleSpeed = -barAngleSpeed;
      }
    }
    if (player.direction === 'left') {
      if (powerBar.rotation < 2 * Math.PI + 3 * Math.PI / 2 + Math.PI / 4) {
        barAngleSpeed = -barAngleSpeed;
      }
      if (powerBar.rotation > 2 * Math.PI + 3 * Math.PI / 2 - Math.PI / 4) {
        barAngleSpeed = -barAngleSpeed;
      }
    }

  }
  powerBar.draw()
  // ballTarget.draw()

  // set ball's position to calculated points
  ballTarget.position.x = getDistanceX(powerBar) //+ barDirection === 'grow' ? ball.width : -ball.width
  ballTarget.position.y = getDistanceY(powerBar) //+ barDirection === 'grow' ? ball.height : -ball.height

  if (state.mode !== 'move') window.requestAnimationFrame(animatePowerBar)
}

const animateBall = () => {
  if (state.portal !== "a" && isColliding(ball, portalA)) {
    console.log('portaled')
    portalB.rotation = powerBar.rotation
    state.portal = "b"
    ballTarget.visible = true
    window.requestAnimationFrame(tempAnimate)
    return
    // ball.position.x = portalA.position.x + portalA.width - ball.position.x + getDistanceX(portalB)
    // ball.position.y = portalA.position.y + portalA.height - ball.position.y + getDistanceY(portalB)
  } else if (state.portal !== "b" && isColliding(ball, portalB)) {
    console.log('portaled')
    portalA.rotation = powerBar.rotation
    state.portal = 'a'
    ball.position.x = getDistanceX(portalA)
    ball.position.y = getDistanceY(portalA)
  } else {

    // arc motion
    const gravity = 2
    const dz = (ballFrames * frame - 0.5 * gravity * Math.pow(frame, 2)) / ballFrames * powerBar.height / club.max
    if (dz < 3 || club.loft < 3) {
      ball.width = 3
      ball.position.z = 0
      ballShadow.position.x = ball.position.x - 3
      ballShadow.position.y = ball.position.y - 3
    } else if (dz > club.loft && club.loft > 3) {
      ball.width = club.loft
      ball.position.z = club.loft
      ballShadow.position.x = ball.position.x - club.loft - 3
      ballShadow.position.y = ball.position.y - club.loft - 3
    } else {
      ball.width = dz
      ball.position.z = dz
      ballShadow.position.x = ball.position.x - dz
      ballShadow.position.y = ball.position.y - dz
    }
    ballShadow.fillStyle = `rgba(0, 0, 0, ${0.5 - dz / 100})`

    // planar motion
    switch (state.portal) {
      case 'a':
        // ball.position.x = portalA.position.x + portalA.width - ball.position.x + getDistanceX(portalA, frame / ballFrames)
        // ball.position.y = portalA.position.y + portalA.height - ball.position.y + getDistanceY(portalA, frame / ballFrames)
        break;
      case 'b':
        // ball.position.x = portalB.position.x + portalB.width - ball.position.x + getDistanceX(portalB, frame / ballFrames)
        // ball.position.y = portalB.position.y + portalB.height - ball.position.y + getDistanceY(portalB, frame / ballFrames)
        break;
      case '':
      default:
        if (isMovePossible({ ...ball, position: { x: ball.position.x + 1, y: ball.position.y + 1, z: ball.position.z } })) {
          const dx = getDistanceX(powerBar, frame / ballFrames)
          const dy = getDistanceY(powerBar, frame / ballFrames)
          state.delta = { x: ball.position.x - dx, y: ball.position.y - dy }
          ball.position.x = dx
          ball.position.y = dy
        } else {

        }
    }

  }
  ballShadow.draw()
  ball.draw()

  movables.forEach(movable => {
    movable.position.x += state.delta.x * movable.scale
    movable.position.y += state.delta.y * movable.scale
  })

  if (frame < ballFrames) {
    frame++
    window.requestAnimationFrame(animateBall)
  } else {
    state.portal = ""
    ballTarget.visible = false
    frame = 0
    ballFrames = MAX_BALL_FRAMES
    window.requestAnimationFrame(animateBackToPlayer)
  }
}

const animateBackToPlayer = () => {
  const dx = camera.position.x - player.position.x
  const dy = camera.position.y - player.position.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx)

  state.delta = {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance
  }
  movables.forEach(movable => {
    movable.position.x += state.delta.x * movable.scale * frame / ballFrames
    movable.position.y += state.delta.y * movable.scale * frame / ballFrames
  })

  if (frame < ballFrames && (Math.abs(dx) > 1 && Math.abs(dy) > 1)) {
    frame++
    window.requestAnimationFrame(animateBackToPlayer)
  } else {
    frame = 0
    movables = [player, powerBar, clubRadius]
  }
}

const getDistanceX = (boundary, percent = 1) => boundary.position.x + Math.cos(boundary.rotation - Math.PI / 2) * percent * boundary.height + ball.width / 4
const getDistanceY = (boundary, percent = 1) => boundary.position.y + Math.sin(boundary.rotation - Math.PI / 2) * percent * boundary.height + ball.height / 4

const setMoveEverything = (exceptions = []) => {
  console.log('moving everything')
  movables = [
    ballTarget,
    ballShadow,
    ball,
    portalA,
    portalB,
    hole,
    debugBall,
    player,
    powerBar,
    clubRadius,
    ...boundaries,
    ...grounds,
  ].filter(movable => !exceptions.map(e => e.name).includes(movable.name))
}

const debugDraw = () => {
  boundaries.forEach(boundary => {
    context.fillStyle = 'rgba(0, 0, 255, 0.5)'
    context.fillRect(boundary.position.x, boundary.position.y, boundary.width, boundary.height)
  })

  // give the player 1 pixel wide stripes as a measure of distance
  context.fillStyle = 'rgba(0, 0, 255, 0.9)'
  context.fillRect(player.position.x, player.position.y, player.width, player.height)
  context.fillStyle = 'rgba(0, 255, 0, 0.9)'
  context.fillRect(player.position.x + player.width - 1, player.position.y, 1, player.height)
  context.fillRect(player.position.x, player.position.y, 1, player.height)
  context.fillStyle = 'rgba(0, 0, 255, 0.9)'
  context.fillRect(player.position.x + player.width - 2, player.position.y, 1, player.height)
  context.fillRect(player.position.x + 1, player.position.y, 1, player.height)
  context.fillStyle = 'rgba(0, 255, 0, 0.9)'
  context.fillRect(player.position.x + player.width - 3, player.position.y, 1, player.height)
  context.fillRect(player.position.x + 2, player.position.y, 1, player.height)
  context.fillStyle = 'rgba(0, 0, 255, 0.9)'
  context.fillRect(player.position.x + player.width - 4, player.position.y, 1, player.height)
  context.fillRect(player.position.x + 3, player.position.y, 1, player.height)
  context.fillStyle = 'rgba(0, 255, 0, 0.9)'
  context.fillRect(player.position.x + player.width - 5, player.position.y, 1, player.height)
  context.fillRect(player.position.x + 4, player.position.y, 1, player.height)
  context.fillStyle = 'rgba(0, 0, 255, 0.9)'
  context.fillRect(player.position.x + 5, player.position.y, 1, player.height)
}