function deliver(target, path, value) {
  let i
  try {
    for (i = 0; i < path.length - 1; i++) target = target[path[i]]
    if (value !== undefined) {
      target[path[i]] = value
    }
    return target[path[i]]
  } catch (err) {}
}

export { deliver }