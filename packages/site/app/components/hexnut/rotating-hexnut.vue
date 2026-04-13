<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import { shallowRef } from 'vue'
import { createHexnutGeometry } from './hexnut-geometry'
import { DRAG_SENSITIVITY, MOMENTUM_FRICTION, MAX_VELOCITY } from './hexnut-config'

interface Props {
  scale?: number
  initialRotation?: [number, number, number]
  rotationSpeed?: number
  color?: string
  dragState: {
    isDragging: boolean
    deltaX: number
    velocity: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  scale: 2.1,
  initialRotation: () => [-0.7, 0.72, 0],
  rotationSpeed: 0.15,
  color: '#ffffff',
})

const meshRef = shallowRef<any>(null)
const geometry = createHexnutGeometry(1.2, 0.6, 0.5)

let velocity = props.rotationSpeed
let wasDragging = false

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  const mesh = meshRef.value
  if (!mesh) return

  if (props.dragState.isDragging) {
    const dragDelta = props.dragState.deltaX * DRAG_SENSITIVITY
    mesh.rotation.z += dragDelta
    props.dragState.deltaX = 0
    wasDragging = true
  } else {
    if (wasDragging) {
      const rawVelocity = props.dragState.velocity
      const sign = rawVelocity >= 0 ? 1 : -1
      velocity = sign * Math.min(Math.abs(rawVelocity), MAX_VELOCITY)
      wasDragging = false
    }

    const absVelocity = Math.abs(velocity)
    const absTarget = Math.abs(props.rotationSpeed)

    if (absVelocity > absTarget) {
      velocity *= MOMENTUM_FRICTION
      if (absVelocity <= absTarget) {
        velocity = props.rotationSpeed
      }
    } else {
      velocity = props.rotationSpeed
    }

    mesh.rotation.z += delta * velocity
  }
})
</script>

<template>
  <TresMesh
    ref="meshRef"
    :geometry="geometry"
    :scale="scale"
    :rotation="initialRotation"
  >
    <TresMeshStandardMaterial :color="color" />
  </TresMesh>
  <!-- Debug sphere to verify rendering -->
  <TresMesh :position="[2, 0, 0]">
    <TresSphereGeometry :args="[0.5, 32, 32]" />
    <TresMeshStandardMaterial color="#ff0000" />
  </TresMesh>
</template>
