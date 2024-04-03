const _attr = {
  update: (node, value, key) => {
    if (typeof value === 'boolean') {
      value ? node.setAttribute(key, '') : node.removeAttribute(key)
    } else node.setAttribute(key, value)
  }
}
export { _attr }