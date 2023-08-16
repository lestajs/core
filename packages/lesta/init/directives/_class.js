const _class = {
  update: (node, options, key) => {
    const value = typeof options[key] === 'function' ? options[key](node) : options[key]
    value ? node.classList.add(key) : node.classList.remove(key)
  }
}

export { _class }