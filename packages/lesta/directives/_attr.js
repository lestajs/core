const _attr = {
  update: (node, value, key) => {
    if (typeof value === 'boolean') {
      value ? node.target.setAttribute(key, '') : node.target.removeAttribute(key)
    } else node.target.setAttribute(key, value)
  }
}
export { _attr }