const _text = {
  update: (node, value) => node.textContent = value !== Object(value) ? value : JSON.stringify(value)
}

export { _text }