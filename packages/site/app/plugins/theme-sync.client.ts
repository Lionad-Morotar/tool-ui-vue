export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  watch(
    () => colorMode.value,
    (val) => {
      if (val === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
    },
    { immediate: true }
  )
})
