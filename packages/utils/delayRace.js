function delayRace(ms = 0, signal) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve()
      signal?.removeEventListener('abort', abortHandler)
    }, ms)
    const abortHandler = () => {
      clearTimeout(timeoutId)
      reject()
      signal?.removeEventListener('abort', abortHandler)
    }
    signal?.addEventListener('abort', abortHandler)
    if (signal?.aborted) abortHandler()
  })
}
export { delayRace }
