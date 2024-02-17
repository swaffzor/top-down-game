const isColliding = (object, collider) => {
  if (object.shape === 'circle' && collider.shape === 'circle') {
    const dx = object.position.x - collider.position.x
    const dy = object.position.y - collider.position.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < object.width + collider.width
  }

  if (object.shape === 'circle' && collider.shape === 'rect') {
    // return true if object is intersecting more than 50% of it's size
    const objectWidth = object.width / 2
    const objectHeight = object.height / 4
    const colliderWidth = collider.width
    const colliderHeight = collider.height
    return object.position.x + objectWidth > collider.position.x &&
      object.position.x < collider.position.x + colliderWidth &&
      object.position.y + objectHeight > collider.position.y &&
      object.position.y < collider.position.y + colliderHeight &&
      object.position.z < collider.position.z
  }

  return object.position.x + object.width > collider.position.x &&
    object.position.x < collider.position.x + collider.width &&
    object.position.y + object.height > collider.position.y &&
    object.position.y < collider.position.y + collider.height
}

const isMovePossible = (movable) => {
  if (state.mode !== 'move') return false
  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i]
    if (isColliding(movable, boundary)) {
      console.log('colliding')
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
  const polarity = direction === 'down' || direction === 'right' ? 1 : -1

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