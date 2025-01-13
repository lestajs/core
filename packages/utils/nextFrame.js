async function nextFrame() {
  return new Promise(requestAnimationFrame)
}
export { nextFrame }