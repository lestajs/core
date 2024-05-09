const _class = {
  update: (node, value, key) => value ? node.classList.add(key) : node.classList.remove(key)
}
export { _class }