function debounce(fn, timeout = 120) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, timeout)
  }
}

export { debounce }