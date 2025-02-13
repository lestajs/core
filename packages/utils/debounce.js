function debounce(fn, timeout = 120) {
  let timer;
  let lastCall = 0
  return (...args) => {
    const now = Date.now()
    if (now - lastCall > timeout) {
      lastCall = now
      fn(...args)
    } else {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      lastCall = now
      fn(...args)
    }, timeout)
  }
}

export { debounce }