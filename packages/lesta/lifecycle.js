import { revocablePromise, replicate } from '../utils'

async function lifecycle(component, render, aborted, completed, propsData = {}) {
  const ctx = component.context
  ctx.container.refresh = ({ cause, data= {} }) => component.refresh(replicate({ cause, data }))
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
      await revocablePromise(hook(), ctx.abortSignal)
      ctx.phase++
    }
  } catch(e) {
    aborted()
    throw e
  }
  completed?.()
  return ctx.container
}

export { lifecycle }