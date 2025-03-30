const _text = {
  update: (node, value) => {
    if (value === undefined) return
    node.target.textContent = value !== Object(value) ? value : JSON.stringify(value)
  }
}

export { _text }