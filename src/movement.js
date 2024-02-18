const isColliding = (object, collider) => {
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

  if (isMovePossible(tempPlayer)) {
    player.moving = true
    // grounds.forEach(movable => {
    //   movable.position[axis] += movingDistance
    // })
    movables.forEach(boundary => {
      boundary.position[axis] += movingDistance * boundary.scale
    })
  }
}