async function loadModule(src) {
  if (typeof src === 'function') {
    const module = src()
    if (!(module instanceof Promise)) return
    const res = await module
    return res?.default
  } return src
}
export { loadModule }