function delayRace(ms = 0, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('Aborted'))
      return
    }
    const timeoutId = setTimeout(() => {
      resolve()
      cleanup()
    }, ms)
    const abortHandler = () => {
      clearTimeout(timeoutId)
      reject(new Error('Aborted'))
      cleanup()
    }
    const cleanup = () => signal?.removeEventListener('abort', abortHandler)
    signal?.addEventListener('abort', abortHandler)
  })
}
export { delayRace }
