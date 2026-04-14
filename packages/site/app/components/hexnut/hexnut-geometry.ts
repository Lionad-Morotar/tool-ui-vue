import { ExtrudeGeometry, Path, Shape } from 'three'

export function createHexnutGeometry(
  outerRadius = 1,
  innerRadius = 0.5,
  height = 0.4
) {
  const shape = new Shape()

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const x = Math.cos(angle) * outerRadius
    const y = Math.sin(angle) * outerRadius
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()

  const hole = new Path()
  const segments = 32
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    const x = Math.cos(angle) * innerRadius
    const y = Math.sin(angle) * innerRadius
    if (i === 0) hole.moveTo(x, y)
    else hole.lineTo(x, y)
  }
  hole.closePath()
  shape.holes.push(hole)

  const geometry = new ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false
  })
  geometry.center()
  return geometry
}
