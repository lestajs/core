const _event = {
  create: (node, options) => {
    for (const key in options) {
      node.target.addEventListener(key, options[key])
    }
  },
  destroy: (node, options) => {
    for (const key in options) {
      node.target.removeEventListener(key, options[key])
    }
  }
}

export { _event }