import { revocablePromise } from './revocablePromise.js'

async function loadModule(src, signal, aborted) {
  if (typeof src === 'function') {
    const module = src()
    if (!(module instanceof Promise)) return module
    const res = await revocablePromise(module, signal, aborted)
    return { ...res?.default }
  } return { ...src }
}
export { loadModule }