const _evalHTML = {
  update: async (node, options) => {
    const value = typeof options === 'function' ? await options(node) : options
    if (value !== undefined) {
      node.innerHTML = value
    }
  }
}

export { _evalHTML }