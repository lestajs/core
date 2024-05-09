function delay(ms = 0) {
  let timer, _reject
  const promise = new Promise((resolve, reject) => {
    _reject = () => {
      clearTimeout(timer)
      reject()
      promise._pending = false
      promise.rejected = true
    }
    timer = setTimeout(() => {
      clearTimeout(timer)
      resolve()
      promise._pending = false
      promise._fulfilled = true
    }, ms)
  })
  promise._reject = _reject
  promise._pending = true
  promise._rejected = false
  promise._fulfilled = false
  return promise
}

export { delay }
