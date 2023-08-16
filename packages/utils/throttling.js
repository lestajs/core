function throttling(fn, timeout = 50) {
  let timer
  return function perform(...args) {
    if (timer) return
    timer = setTimeout(() => {
      fn(...args)
      clearTimeout(timer)
      timer = null
    }, timeout)
  }
}

export { throttling }