// file deepcode ignore DuplicateIfBody: <please specify a reason of ignoring this>
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

canvas.width = 900 //* 16
canvas.height = 506 //* 9

const initMapPos = { x: canvas.width / 6, y: canvas.height / 6 }
const background = new Sprite({ image: './sprites/test-map.png', position: initMapPos, scale: 0.5 })
const foreground = new Sprite({ image: './sprites/test-map-foreground.png', position: initMapPos, scale: 0.5 })

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
  image: './sprites/portal3.png',
  position: { x: 570, y: 220 },
  frames: { max: 7 },
})

const portalB = new Sprite({
  image: './sprites/portal3.png',
  position: { x: 262, y: 200 },
  frames: { max: 7 },
})

const hole = new Sprite({
  image: './sprites/hole.png',
  position: { x: 310, y: 225 },
  frames: { max: 1 },
  name: 'hole',
  width: 15,
  height: 10,
  shape: 'rect',
  fillStyle: 'rgba(255, 0, 0, 0)'
})

const ball = new Collider({
  name: 'ball',
  position: { x: 391, y: 250, z: 0 },
  width: 3,
  height: 3,
  shape: 'circle',
  fillStyle: 'rgba(255, 255, 255, 1)'
})

const ballTarget = new Collider({
  name: 'ballTarget',
  position: { x: ball.position.x, y: ball.position.y },
  width: 3,
  height: 3,
  shape: 'circle',
  fillStyle: 'rgba(255, 0, 0, 0.75)',
  visible: false,
})

const ballShadow = new Collider({
  name: 'ballShadow',
  position: { x: ball.position.x, y: ball.position.y + 3 },
  width: 3,
  height: 3,
  shape: 'circle',
  fillStyle: 'rgba(0, 0, 0, 0.5)'
})

const powerBar = new Collider({
  name: 'powerBar',
  position: { ...ball.position },
  width: 3,
  height: 100,
  rotation: 2 * Math.PI,
  shape: 'rect',
  fillStyle: 'rgba(255, 0, 255, 1.5)'
})

const clubRadius = new Collider({
  name: 'clubRadius',
  position: { ...ball.position },
  width: 100,
  height: 10,
  shape: 'circle',
  fillStyle: 'rgba(0, 0, 255, 0.25)',
  strokeStyle: 'rgba(0, 0, 255, 0.5)',
  render: 'stroke',
  visible: false,
})


const player = new Sprite({
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

let club = {
  position: { x: player.position.x + 16, y: player.position.y },
  max: 100,
  loft: 0,
  name: '5',
  bag: {
    1: { name: '1', max: 100, loft: 3, barHeightSpeed: 1, barAngleSpeed: 0.15 },
    2: { name: '2', max: 90, loft: 5, barHeightSpeed: 1, barAngleSpeed: 0.14 },
    3: { name: '3', max: 80, loft: 7, barHeightSpeed: 1.5, barAngleSpeed: 0.13 },
    4: { name: '4', max: 70, loft: 10, barHeightSpeed: 1.5, barAngleSpeed: 0.12 },
    5: { name: '5', max: 60, loft: 13, barHeightSpeed: 1, barAngleSpeed: 0.11 },
    6: { name: '6', max: 50, loft: 16, barHeightSpeed: 1, barAngleSpeed: 0.10 },
    7: { name: '7', max: 40, loft: 19, barHeightSpeed: 1.5, barAngleSpeed: 0.09 },
    8: { name: '8', max: 30, loft: 22, barHeightSpeed: 1.5, barAngleSpeed: 0.08 },
    9: { name: '9', max: 20, loft: 25, barHeightSpeed: 1, barAngleSpeed: 0.07 },
    w: { name: 'w', max: 10, loft: 30, barHeightSpeed: 1.75, barAngleSpeed: 0.06 },
    p: { name: 'p', max: 35, loft: 0, barHeightSpeed: 1.5, barAngleSpeed: 0.13 },
  }
}
club = { ...club.bag[club.name], bag: { ...club.bag } }

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 26) {
  collisionsMap.push(collisions.slice(i, i + 26))
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
          y: y * Collider.height + initMapPos.y,
          z: boundaryHeight[cell],
        },
        visible: true,
        fillStyle: 'rgba(255, 255, 255, 0.0025)',
        strokeStyle: 'rgba(255, 0, 0, 0.0050)',
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
})

const grounds = [background, foreground]

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
]

let drawables = [
  background,
  portalA,
  portalB,
  hole,
  ballShadow,
  ballTarget,
  ball,
  clubRadius,
  player,
  foreground,
  debugBall,
  ...boundaries,
]

let state = {
  mode: 'move',
  par: 3,
  strokes: 0,
  portal: '',
}


const STEP = 1
const RUN = 2
const OFFSET = 0
const MAX_BALL_FRAMES = 100
let barDirection = ''
let barHeightSpeed = 2
let barAngleSpeed = 0.05
let ballFrames = MAX_BALL_FRAMES
let counter = 0
let ballHasPortaled = false
let timeOutValue = 0
let radiusTimeout = 0

animate()

canvas.addEventListener('click', (event) => {
  var x = event.offsetX
  var y = event.offsetY
  console.log(`x: ${x} y: ${y}`);
  debugBall.position = { x, y, z: 0 }
  debugBall.visible = true
  // debugBall.draw()
}, false);
