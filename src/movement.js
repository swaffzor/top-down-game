const isColliding = (object, collider) => {
  const temp = getOverlap(object, collider)
  if (temp[0] > 0 && temp[1] > 0) {
    console.log(`${object.name} overlapping ${collider.name}`)
    return true
  }
  if (object.shape === 'circle' && collider.shape === 'circle') {
    console.log('circle colliding circle')
    const dx = object.position.x - collider.position.x
    const dy = object.position.y - collider.position.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < object.width + collider.width
  }

  // return true if object is intersecting more than 50% of it's size
  const objectWidth = object.width / 2
  const objectHeight = object.height / 2
  const colliderWidth = collider.width
  const colliderHeight = collider.height
  const result = object.position.x + objectWidth > collider.position.x &&
    object.position.x < collider.position.x + colliderWidth &&
    object.position.y + objectHeight > collider.position.y &&
    object.position.y < collider.position.y + colliderHeight
    && object.position.z <= collider.position.z
  result && console.log(`${object.name} colliding ${collider.name}`)
  return result
}

const isMovePossible = (movable) => {
  if (state.mode !== 'move') return false
  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i]
    if (isColliding(movable, boundary)) {
      moving = false
      return false
    }
  }
  return true
}

const makePlayerMove = (direction) => {
  if (state.mode === "move") player.direction = direction
  player.image = player.sprites[direction]

  const axis = direction === 'down' || direction === 'up' ? 'y' : 'x'
  const polarity = direction === 'up' || direction === 'left' ? 1 : -1

  const movingDistance = polarity * (player.running ? RUN : STEP)
  const movingOffset = -1 * polarity * (player.running ? OFFSET * RUN : OFFSET)
  const tempPlayer = { ...player, position: { ...player.position, [axis]: player.position[axis] + movingDistance + movingOffset } }

  // if (isMovePossible(tempPlayer)) {
  player.moving = true
  // grounds.forEach(movable => {
  //   movable.position[axis] += movingDistance
  // })
  movables.forEach(boundary => {
    boundary.position[axis] += movingDistance * boundary.scale
  })
  // }
}

const isTouchingCanvas = (collidable) => collidable.x + collidable.width > canvas.width || collidable.x - collidable.width < 0 || collidable.y + collidable.width > canvas.height || collidable.y - collidable.width < 0
const isCollidingX = () => ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0
const isCollidingY = () => ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0
// const isColliding = () => isCollidingX() || isCollidingY()

const getOverlap = (rect, circle) => {
  const xOverlap = Math.max(0, Math.min(circle.position.x + circle.width, rect.position.x + rect.width) - Math.max(circle.position.x - circle.width, rect.position.x))
  const yOverlap = Math.max(0, Math.min(circle.position.y + circle.width, rect.position.y + rect.height) - Math.max(circle.position.y - circle.width, rect.position.y))
  return [xOverlap, yOverlap]
}

const getRotatedOverlap = (rect, circle) => {
  if (rect.angle === 0) return getOverlap(rect, circle);
  else {
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;

    const dx = circle.x - centerX;
    const dy = circle.y - centerY;

    // rotate around rect center
    const rotatedcircleX = dx * Math.cos(-rect.angle) - dy * Math.sin(-rect.angle) + centerX;
    const rotatedcircleY = dx * Math.sin(-rect.angle) + dy * Math.cos(-rect.angle) + centerY;

    const xOverlap = Math.max(0, Math.min(rotatedcircleX + circle.radius, rect.x + rect.width) - Math.max(rotatedcircleX - circle.radius, rect.x));
    const yOverlap = Math.max(0, Math.min(rotatedcircleY + circle.radius, rect.y + rect.height) - Math.max(rotatedcircleY - circle.radius, rect.y));

    return [xOverlap, yOverlap];
  }
}