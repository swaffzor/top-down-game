// file deepcode ignore DuplicateIfBody: <please specify a reason of ignoring this>
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

canvas.width = 1150  //* 16
canvas.height = 600 //* 9

const initMapPos = { x: canvas.width / 6, y: canvas.height / 6 }
const background = new Sprite({ name: 'background', image: './sprites/golf-course-test.png', position: initMapPos, scale: 1 })
// const foreground = new Sprite({ name: 'foreground', image: './sprites/test-map-foreground.png', position: initMapPos, scale: 0.5 })

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

const portalA = new Sprite({
  name: 'portalA',
  image: './sprites/portal3.png',
  position: { x: 250, y: 350, z: 20 },
  frames: { max: 7 },
})

const portalB = new Sprite({
  name: 'portalB',
  image: './sprites/portal3.png',
  position: { x: 230, y: 150, z: 20 },
  frames: { max: 7 },
})


const powerBar = new Collider({
  name: 'powerBar',
  position: { x: 0, y: 0, z: 0 },
  width: 3,
  height: 100,
  rotation: 2 * Math.PI,
  shape: 'rect',
  fillStyle: 'rgba(255, 0, 255, 1)',
  strokeStyle: 'rgba(255, 0, 0, 1)',
})

const clubRadius = new Collider({
  name: 'clubRadius',
  position: { ...powerBar.position },
  width: 100,
  height: 10,
  shape: 'circle',
  fillStyle: 'rgba(0, 0, 255, 0.25)',
  strokeStyle: 'rgba(0, 0, 255, 0.5)',
  renderMode: 'stroke',
  visible: false,
})


const player = new Sprite({
  name: 'player',
  image: './sprites/alex/idle_down.png',
  position: {
    x: canvas.width / 2 - 30,
    y: canvas.height / 2 - 30,
    z: 0,
  },
  direction: 'down',
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
  onLoad: (width, height) => {
    powerBar.position = { x: player.position.x + width / 2, y: player.position.y + height / 2 }
    clubRadius.position = { x: player.position.x + width / 2, y: player.position.y + height / 2 }
  }
})

const hole = new Sprite({
  name: 'hole',
  image: './sprites/hole.png',
  position: { x: canvas.width + Math.random() * 1000, y: canvas.height + Math.random() * 1000, z: 0 },
  frames: { max: 1 },
  width: 15,
  height: 10,
  shape: 'rect',
  fillStyle: 'rgba(255, 0, 0, 0)'
})

const ball = new Collider({
  name: 'ball',
  position: { x: player.position.x, y: player.position.y + 10, z: 0 },
  width: 4,
  height: 4,
  shape: 'circle',
  fillStyle: 'rgba(255, 255, 255, 1)',
  strokeStyle: 'rgba(0, 0, 0, 0.25)',
})

const ballTarget = new Collider({
  name: 'ballTarget',
  position: { x: ball.position.x, y: ball.position.y },
  width: 3,
  height: 3,
  shape: 'circle',
  fillStyle: 'rgba(255, 0, 0, 0.75)',
  strokeStyle: 'rgba(0, 0, 0, 0.5)',
  visible: false,
})

const ballShadow = new Collider({
  name: 'ballShadow',
  position: { x: ball.position.x, y: ball.position.y + 3 },
  width: 2,
  height: 2,
  shape: 'circle',
  fillStyle: 'rgba(0, 0, 0, 0.5)',
  strokeStyle: 'rgba(0, 0, 0, 0.5)',
})

let club = {
  position: { x: player.position.x + 16, y: player.position.y },
  max: 100,
  loft: 0,
  name: '1',
  bag: {
    1: { name: '1', max: 500, loft: 3, barHeightSpeed: 1, barAngleSpeed: 0.15 / 10 },
    2: { name: '2', max: 450, loft: 5, barHeightSpeed: 1, barAngleSpeed: 0.14 / 10 },
    3: { name: '3', max: 400, loft: 7, barHeightSpeed: 1.5, barAngleSpeed: 0.13 / 10 },
    4: { name: '4', max: 350, loft: 10, barHeightSpeed: 1.5, barAngleSpeed: 0.12 / 10 },
    5: { name: '5', max: 300, loft: 13, barHeightSpeed: 1, barAngleSpeed: 0.11 / 10 },
    6: { name: '6', max: 250, loft: 16, barHeightSpeed: 1, barAngleSpeed: 0.10 / 10 },
    7: { name: '7', max: 200, loft: 19, barHeightSpeed: 1.5, barAngleSpeed: 0.09 / 10 },
    8: { name: '8', max: 150, loft: 22, barHeightSpeed: 1.5, barAngleSpeed: 0.08 / 10 },
    9: { name: '9', max: 100, loft: 25, barHeightSpeed: 1, barAngleSpeed: 0.07 / 10 },
    w: { name: 'w', max: 110, loft: 30, barHeightSpeed: 1.75, barAngleSpeed: 0.06 / 10 },
    p: { name: 'p', max: 135, loft: 0, barHeightSpeed: 1.5, barAngleSpeed: 0.13 / 10 },
  }
}
club = { ...club.bag[club.name], bag: { ...club.bag } }

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 26) {
  // collisionsMap.push(collisions.slice(i, i + 26))
}

const boundaryHeight = {
  152: 0, // object on ground
  168: 7, // object at head level
  184: 14, // object above head
}

const boundaries = []
collisionsMap.forEach((row, y) => {
  row.forEach((cell, x) => {
    if (cell > 0) {
      boundaries.push(new Collider({
        position: {
          x: x * Collider.width + initMapPos.x,
          y: y * Collider.height + initMapPos.y - 10,
          z: boundaryHeight[cell],
        },
        visible: false,
        shape: 'rect',
        rotation: null,
        fillStyle: 'rgba(255, 123, 0, 0.33)',
        strokeStyle: 'rgba(255, 255, 255, 1)',
        name: `boundary-${x}-${y}`,
      }))
    }
  })
})

const debugBall = new Collider({
  name: 'debugBall',
  position: { x: 0, y: 0, z: 0 },
  width: 3,
  height: 3,
  shape: 'circle',
  visible: false,
  fillStyle: 'rgba(255, 255, 0, 0.8)',
  strokeStyle: 'rgba(255, 255, 0, 1)',
})

const camera = new Collider({
  name: 'camera',
  position: { ...player.position },
  width: 3,
  height: 3,
  shape: 'circle',
  visible: false,
  fillStyle: 'rgba(255, 255, 0, 0)',
  strokeStyle: 'rgba(255, 255, 0, 0)',
})

const holePointer = new Collider({
  name: 'holePointer',
  position: { ...player.position },
  width: 10,
  height: 50,
  shape: 'custom',
  fillStyle: 'rgba(255, 255, 255, 0.5)',
  strokeStyle: 'rgba(255, 255, 255, 1)',
  renderMode: 'fill',
  visible: false,
  customRender: () => {
    context.fillStyle = holePointer.fillStyle
    context.strokeStyle = holePointer.strokeStyle
    const point1 = ball.position
    const point2 = hole.position

    const deltaX = point2.x - point1.x;
    const deltaY = point2.y - point1.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angleInRadians = Math.atan2(deltaY, deltaX);

    const shortPoint = {
      x: point1.x + Math.cos(angleInRadians) * distance * .15,
      y: point1.y + Math.sin(angleInRadians) * distance * .15,
    }

    context.save();
    context.lineWidth = 5
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(shortPoint.x, shortPoint.y);
    context.stroke();

    context.translate(shortPoint.x, shortPoint.y);
    context.rotate(angleInRadians);
    context.beginPath();
    context.moveTo(-10, -5);
    context.lineTo(0, 0);
    context.lineTo(-10, 5);
    context.stroke();
    context.restore();
  }
})

const grounds = [background]

let movables = [
  // ballShadow,
  // ball,
  // portalA,
  // portalB,
  // hole,
  // debugBall,
  // ...boundaries,
  powerBar,
  clubRadius,
  player,
  camera,
]

let drawables = [
  background,
  portalA,
  portalB,
  holePointer,
  hole,
  ballShadow,
  ballTarget,
  ball,
  clubRadius,
  player,
  debugBall,
]

let state = {
  mode: 'move',
  par: 3,
  strokes: 0,
  portal: '',
  delta: { ...ball.position },
}


const STEP = 1
const RUN = 2
const OFFSET = 0
const MAX_BALL_FRAMES = 100
let barDirection = ''
let barHeightSpeed = 2
let barAngleSpeed = 0.05
let ballFrames = MAX_BALL_FRAMES
let frame = 0
let ballHasPortaled = false
let timeOutValue = 0
let radiusTimeout = 0

animate()

canvas.addEventListener('click', (event) => {
  var x = event.offsetX
  var y = event.offsetY
  console.log(`x: ${x}, y: ${y}`);
  debugBall.position = { x, y, z: 0 }
  debugBall.visible = true

  const drawable = drawables.find(drawable => drawable.name !== debugBall.name && drawable?.name?.includes('boundary-') && isColliding(debugBall, drawable))
  const boundary = boundaries.find(boundary => isColliding(debugBall, boundary))
  if (boundary && boundary.name !== drawable.name) {
    console.log('boundary', boundary)
    boundary.fillStyle = 'rgba(255, 255, 255, 1)'
  }
  if (drawable) {
    console.log('drawable', drawable)
  }
}, false);
