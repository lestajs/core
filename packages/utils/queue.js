const queue = () => {
  const funcQueue = []
  let processing = false
  
  const size = () => funcQueue.length
  const isEmpty = () => funcQueue.length === 0
  
  const add = (fn) => {
    funcQueue.push(fn)
    if (!processing) {
      processing = true
      next()
    }
  }
  
  const next = async () => {
    const action = funcQueue.at(0)
    if (action) {
      await action()
      funcQueue.shift()
      next()
    } else {
      processing = false
    }
  }
  
  return { add, isEmpty, size }
}

export { queue }