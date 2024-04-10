const _text = {
  update: (node, value) => {
    if (value !== undefined) node.textContent = value !== Object(value) ? value : JSON.stringify(value)
  }
}

export { _text }