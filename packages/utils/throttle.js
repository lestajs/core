function throttle(fn, timeout = 50) {
  let timer = null
  return function perform(...args) {
    if (timer !== null) return
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, timeout)
  }
}

export { throttle }