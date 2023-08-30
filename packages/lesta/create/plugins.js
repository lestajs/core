export default {
  get isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined'
  }
}