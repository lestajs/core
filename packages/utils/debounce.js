function debounce(fn, timeout = 120) {
  return function perform(...args) {
    let previousCall = this.lastCall
    this.lastCall = Date.now()
    if (previousCall && this.lastCall - previousCall <= timeout) {
      clearTimeout(this.lastCallTimer)
    }
    this.lastCallTimer = setTimeout(() => fn(...args), timeout)
  }
}

export { debounce }