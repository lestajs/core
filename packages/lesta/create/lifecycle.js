async function lifecycle(component, render, aborted, props) {
  let status = 0
  const hooks = [
    async () => await component.loaded(),
    async () => {
      component.context.container = render()
      if (typeof document !== 'undefined') return await component.rendered()
    },
    async () => {
      await component.props(props)
      component.params()
      component.methods()
      component.proxies()
      return await component.created()
    },
    async () => {
      await component.nodes()
      if (typeof document !== 'undefined') return await component.mounted()
    }
  ]
  for await (const hook of hooks) {
    const data = await hook()
    status++
    if (component.context.abortSignal?.aborted || data) {
      aborted && aborted({ status, data, abortSignal: component.context.abortSignal })
      return
    }
  }
  return component.context.container
}

export { lifecycle }