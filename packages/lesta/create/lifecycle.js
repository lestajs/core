async function lifecycle(component, render, aborted) {
  const hooks = [
    async () => await component.loaded(),
    async () => {
      component.context.container = render()
      if (typeof document !== 'undefined') return await component.rendered()
    },
    async () => {
      await component.props()
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
    component.context.phase++
    if (component.context.abortSignal?.aborted || data) {
      aborted && aborted({ phase: component.context.phase, data, abortSignal: component.context.abortSignal })
      return
    }
  }
  return component.context.container
}

export { lifecycle }