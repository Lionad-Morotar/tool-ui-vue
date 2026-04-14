import { OverlayScrollbars } from 'overlayscrollbars'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      overlayScrollbars: OverlayScrollbars
    }
  }
})
