/* eslint-disable @typescript-eslint/no-explicit-any */
// Type declarations for dynamically imported Shiki themes
declare module '*/pierre-dark-theme.js' {
  const theme: any
  export default theme
}

declare module '*/pierre-light-theme.js' {
  const theme: any
  export default theme
}

// CSS modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// CSS side-effect imports
declare module 'leaflet/dist/leaflet.css' {
  export default string
}
