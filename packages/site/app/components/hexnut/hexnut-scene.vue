<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { THEME_CONFIGS, DRAG_SENSITIVITY, MOMENTUM_FRICTION, MAX_VELOCITY } from './hexnut-config'
import { createHexnutGeometry } from './hexnut-geometry'

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')
const config = computed(() => (isDark.value ? THEME_CONFIGS.dark : THEME_CONFIGS.light))
const hexnutColor = computed(() => (isDark.value ? '#ffffff' : '#111827'))

let rafId: number | null = null
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let mesh: THREE.Mesh | null = null
let directionalLight: THREE.DirectionalLight | null = null

const dragState = ref({
  isDragging: false,
  deltaX: 0,
  velocity: 0,
})
const previousX = ref(0)
const lastMoveTime = ref(0)
let velocity = config.value.speed
let audioCtx: AudioContext | null = null
let lastNotch = 0

const NOTCH_ANGLE = Math.PI / 6

function playClick() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  const t = audioCtx.currentTime
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(1200, t)
  osc.frequency.exponentialRampToValueAtTime(300, t + 0.035)

  gain.gain.setValueAtTime(0.22, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035)

  osc.connect(gain)
  gain.connect(audioCtx.destination)

  osc.start(t)
  osc.stop(t + 0.04)
}

function handlePointerDown(e: PointerEvent) {
  dragState.value.isDragging = true
  dragState.value.velocity = 0
  previousX.value = e.clientX
  lastMoveTime.value = performance.now()
  if (mesh) {
    lastNotch = Math.floor(mesh.rotation.z / NOTCH_ANGLE)
  }
  containerRef.value?.setPointerCapture(e.pointerId)
}

function handlePointerUp(e: PointerEvent) {
  dragState.value.isDragging = false
  containerRef.value?.releasePointerCapture(e.pointerId)
}

function handlePointerMove(e: PointerEvent) {
  if (!dragState.value.isDragging) return
  const now = performance.now()
  const dt = (now - lastMoveTime.value) / 1000
  const dx = e.clientX - previousX.value

  dragState.value.deltaX = dx
  if (dt > 0) {
    dragState.value.velocity = (dx * DRAG_SENSITIVITY) / dt
  }

  previousX.value = e.clientX
  lastMoveTime.value = now
}

function init() {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return

  const width = container.clientWidth
  const height = container.clientHeight

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
  camera.position.z = config.value.cameraZ

  directionalLight = new THREE.DirectionalLight(0xffffff, config.value.intensity)
  directionalLight.position.set(config.value.lightX, config.value.lightY, config.value.lightZ)
  scene.add(directionalLight)

  const geometry = createHexnutGeometry(1.2, 0.6, 0.5)
  const material = new THREE.MeshStandardMaterial({ color: hexnutColor.value })
  mesh = new THREE.Mesh(geometry, material)
  mesh.scale.set(config.value.scale, config.value.scale, config.value.scale)
  mesh.rotation.set(config.value.rotX, config.value.rotY, 0)
  lastNotch = Math.floor(mesh.rotation.z / NOTCH_ANGLE)
  scene.add(mesh)

  animate()
}

function animate() {
  rafId = requestAnimationFrame(animate)

  if (!mesh || !renderer || !scene || !camera) return

  if (dragState.value.isDragging) {
    const dragDelta = dragState.value.deltaX * DRAG_SENSITIVITY
    mesh.rotation.z += dragDelta
    dragState.value.deltaX = 0

    const notch = Math.floor(mesh.rotation.z / NOTCH_ANGLE)
    if (notch !== lastNotch) {
      playClick()
      lastNotch = notch
    }
  } else {
    const absVelocity = Math.abs(velocity)
    const absTarget = Math.abs(config.value.speed)

    if (absVelocity > absTarget) {
      velocity *= MOMENTUM_FRICTION
      if (absVelocity <= absTarget) {
        velocity = config.value.speed
      }
    } else {
      velocity = config.value.speed
    }

    mesh.rotation.z += (1 / 60) * velocity
  }

  renderer.render(scene, camera)
}

function updateTheme() {
  if (!directionalLight || !mesh || !camera) return
  directionalLight.position.set(config.value.lightX, config.value.lightY, config.value.lightZ)
  directionalLight.intensity = config.value.intensity
  camera.position.z = config.value.cameraZ
  ;(mesh.material as THREE.MeshStandardMaterial).color.set(hexnutColor.value)
}

function handleResize() {
  if (!renderer || !camera || !containerRef.value) return
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', handleResize)
  renderer?.dispose()
})

watch(() => config.value, updateTheme, { deep: true })
</script>

<template>
  <div
    ref="containerRef"
    class="relative h-full w-full overflow-hidden"
    :class="[dragState.isDragging ? 'cursor-grabbing' : 'cursor-grab']"
    :style="{ touchAction: 'none' }"
    @pointerdown="handlePointerDown"
    @pointerup="handlePointerUp"
    @pointerleave="handlePointerUp"
    @pointermove="handlePointerMove"
  >
    <canvas ref="canvasRef" class="block h-full w-full" />
  </div>
</template>
