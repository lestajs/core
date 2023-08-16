function delay(delay) {
  let timer, stop
  const promise = new Promise((resolve, reject) => {
    stop = () => {
      promise.delaying = false
      clearTimeout(timer)
      reject()
    }
    timer = setTimeout(() => {
      promise.delaying = false
      clearTimeout(timer)
      resolve()
    }, delay || 0)
  })
  promise.stop = stop
  promise.delaying = true
  return promise
}

export { delay }
