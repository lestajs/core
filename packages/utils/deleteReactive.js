function deleteReactive(reactivity, path) {
  for (let [fn, refs] of reactivity) {
    if (Array.isArray(refs)) {
      const index = refs.indexOf(path)
      if (index !== -1) {
        if (refs.length === 1) {
          reactivity.delete(fn)
        } else {
          refs.splice(index, 1)
        }
      }
    } else if (refs === path) {
      reactivity.delete(fn)
    }
  }
}

export { deleteReactive }