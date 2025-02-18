function mapProps(keys, value) {
  return keys.reduce((acc, key) => {
    acc[key] = value
    return acc
  }, {})
}

export { mapProps }