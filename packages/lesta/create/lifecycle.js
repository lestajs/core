async function lifecycle(component, render, aborted, props) {
  let status = 0
  let container = null
  const hooks = [
    async () => await component.loaded(),
    async () => {
      container = render()
      return await component.rendered(container)
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
    const data = await hook()
    status++
    if (component.context.abortSignal?.aborted || data) {
      aborted && aborted({ status, data, abortSignal: component.context.abortSignal })
      return
    }
  }
  return container
}

export { lifecycle }