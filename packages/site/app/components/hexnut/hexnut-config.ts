export interface ThemeConfig {
  lightX: number
  lightY: number
  lightZ: number
  intensity: number
  rotX: number
  rotY: number
  scale: number
  speed: number
  cameraZ: number
}

export const THEME_CONFIGS: Record<'dark' | 'light', ThemeConfig> = {
  dark: {
    lightX: -50,
    lightY: -50,
    lightZ: -31,
    intensity: 4,
    rotX: -0.7,
    rotY: 0.72,
    scale: 2.1,
    speed: 0.15,
    cameraZ: 6.8
  },
  light: {
    lightX: 50,
    lightY: 50,
    lightZ: 50,
    intensity: 50,
    rotX: -0.7,
    rotY: 0.72,
    scale: 2.1,
    speed: 0.15,
    cameraZ: 6.8
  }
}

export const DRAG_SENSITIVITY = 0.01
export const MOMENTUM_FRICTION = 0.96
export const MAX_VELOCITY = 10
