const _evalHTML = {
  update: (node, value) => value !== undefined ? node.innerHTML = value : ''
}
export { _evalHTML }