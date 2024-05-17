function deliver(target, path = [], value) {
  const p = Array.isArray(path) ? path : path.split('.')
  let i
  try {
    for (i = 0; i < p.length - 1; i++) target = target[p[i]]
    if (value !== undefined) target[p[i]] = value
    return target[p[i]]
  } catch (err) {}
}

export { deliver }