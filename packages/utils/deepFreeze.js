function deepFreeze(obj) {
  Object.freeze(obj)
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const propVal = obj[prop]
    if (
      propVal !== null &&
      (typeof propVal === 'object' || typeof propVal === 'function') &&
      !Object.isFrozen(propVal)
    ) {
      deepFreeze(propVal)
    }
  })
  return obj
}

export { deepFreeze }