const _attr = {
  update: (node, value, key) => {
    if (typeof value === 'boolean') {
      if (value) {
        node.setAttribute(key, '')
      } else node.removeAttribute(key)
    } else if (value) node.setAttribute(key, value)
  }
}
export { _attr }