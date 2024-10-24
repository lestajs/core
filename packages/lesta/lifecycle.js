import { revocablePromise } from '../utils'

async function lifecycle(component, render, propsData, aborted) {
  const hooks = [
    async () => await component.loaded(propsData),
    async () => {
      await component.props(propsData)
      component.params()
      component.methods()
      component.proxies()
      await component.created()
    },
    async () => {
      render()
      await component.rendered()
    },
    async () => {
      await component.nodes()
      await component.mounted()
    }
  ]
  try {
    for await (const hook of hooks) {
      await revocablePromise(hook(), component.context.abortSignal)
      component.context.phase++
    }
  } catch (error) {
    aborted()
  }
  propsData.completed?.()
  return component.context.container
}

export { lifecycle }