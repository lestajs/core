function mapProps(arr, options) {
  const res = {}
  arr.forEach(key => Object.assign(res, {[key]: options}))
  return res
}

export { mapProps }