async function lifecycle(nodeElement, component, render, aborted, props) {
  let status = 0
  let container = null
  const hooks = [
    async () => await component.loaded(),
    async () => {
      container = render()
      await component.rendered(container)
    },
    async () => {
      await component.props(props)
      component.params()
      component.methods()
      component.proxies()
    },
    async () => await component.created(),
    async () => await component.nodes(),
    async () => await component.mounted()
  ]
  for await (const hook of hooks) {
    if (component.signal?.aborted) {
      aborted && aborted({ status })
      return
    }
    await hook()
    status++
  }
  return container
}

export { lifecycle }