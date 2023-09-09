const _classes = {
  update: (node, options, key) => {
    const value = typeof options[key] === 'function' ? options[key]() : options[key]
    requestAnimationFrame((time) => {
      if (value) {
        requestAnimationFrame((time) => {
          node.classList.add(key)
        })
      } else {
        requestAnimationFrame((time) => {
          node.classList.remove(key)
        })
      }
    })
  }
}

const _attr = {
  update: (node, options, key) => {
    const value = typeof options[key] === 'function' ? options[key]() : options[key]
    if (typeof value === 'boolean') {
      if (value) {
        node.setAttribute(key, '')
      } else node.removeAttribute(key)
    } else if (value) node.setAttribute(key, value)
  }
}

const _outside = {
  stop: (event) => event.stopPropagation(),
  create: (node, options, directive) => {
    if (typeof options.change === 'function') {
      if (options.stop) node.addEventListener('click', directive.stop)
      document.addEventListener('click', options.change)
    }
  },
  destroy: (node, options, directive) => {
    if (options.stop) node.removeEventListener('click', directive.stop)
    document.removeEventListener('click', options.change)
  }
}

export { _classes, _attr, _outside }