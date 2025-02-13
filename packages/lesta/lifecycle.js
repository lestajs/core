import { revocablePromise } from '../utils'

async function lifecycle(component, render, aborted, completed, propsData = {}) {
  const hooks = [
    async () => await component.loaded(),
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
  } catch(e) {
    aborted()
    throw e
  }
  completed?.()
  return component.context.container
}

export { lifecycle }