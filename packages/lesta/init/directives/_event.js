const _event = {
  create: (node, options) => {
    for (const key in options) {
      node.addEventListener(key, options[key])
    }
  },
  destroy: (node, options) => {
    for (const key in options) {
      node.removeEventListener(key, options[key])
    }
  }
}

export { _event }