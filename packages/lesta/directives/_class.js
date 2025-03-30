const _class = {
  update: (node, value, key) => value ? node.target.classList.add(key) : node.target.classList.remove(key)
}
export { _class }