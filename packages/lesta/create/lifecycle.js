async function lifecycle(component, container, props) {
  const hooks = [
    async () => await component.loaded(container),
    async () => {
      await component.props(props)
      component.params()
      component.methods()
      component.proxies()
      return false
    },
    async () => await component.created(),
    async () => await component.nodes(),
    async () => await component.mounted()
  ]
  let WASTED = false
  for await (const hook of hooks) {
    WASTED = await hook() || !container.unmount
    if (WASTED) break
  }
  return {
    options: component.component,
    context: component.context,
    container,
    WASTED
  }
}

export { lifecycle }