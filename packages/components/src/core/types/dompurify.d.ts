// Optional peerDependency declaration — allows dynamic import without the package installed
declare module 'dompurify' {
  interface DOMPurifyI {
    sanitize(dirty: string): string;
  }
  const _default: DOMPurifyI;
  export default _default;
}
