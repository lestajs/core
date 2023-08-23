export default {
  get isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined'
  },
  get isMobileDevice() {
    return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1)
  }
}