async function nextRepaint() {
  return new Promise(requestAnimationFrame)
}
export { nextRepaint }