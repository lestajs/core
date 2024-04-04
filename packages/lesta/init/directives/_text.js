const _text = {
  update: async (node, options) => {
    const value = typeof options === 'function' ? await options(node) : options
    // if (value !== undefined) {
      node.textContent = value
    // }
  }
}

export { _text }