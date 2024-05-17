import { replicate } from '../utils/index'

async function lifecycle(component, render, props) {
  const hooks = [
    async () => {
      component.context.props = props
      await component.loaded()
    },
    async () => {
      await component.props(props)
      component.params()
      component.methods()
      component.proxies()
      delete component.context.props
      return await component.created()
    },
    async () => {
      render()
      return await component.rendered()
    },
    async () => {
      await component.nodes()
      return await component.mounted()
    }
  ]
  const result = (data) => {
    return {
      container: component.context.container,
      phase: component.context.phase,
      data
    }
  }
  for await (const hook of hooks) {
    const data = await hook()
    component.context.phase++
    if (component.context.abortSignal?.aborted || data) {
      props.aborted?.(result(replicate(data)))
      return
    }
  }
  props.completed?.(result(null))
  return component.context.container
}

export { lifecycle }