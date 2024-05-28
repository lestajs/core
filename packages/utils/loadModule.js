async function loadModule(src, signal) {
  if (typeof src === 'function') {
    const module = src()
    if (!(module instanceof Promise) || signal?.aborted) return
    const load = async () => {
      if (signal) {
        if (signal.aborted) return
        return await Promise.race([module, new Promise((resolve) => signal.addEventListener('abort', () => resolve()))])
      } else {
        return await module
      }
    }
    const res = await load()
    return { ...res?.default }
  } return { ...src }
}
export { loadModule }