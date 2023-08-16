async function lifecycle(component, container, props) {
  await component.loaded(container)
  props && await component.props(props)
  component.params()
  component.methods()
  component.proxies()
  await component.created()
  await component.nodes()
  await component.mounted()
}

export { lifecycle }