import { lifecycle } from './lifecycle'
import { InitNode } from './initNode'
import withoutComponent from './factoryNode'
import { errorComponent } from '../utils/errors/component'
import { cleanHTML } from '../utils'

async function mountWidget({ options, target, name = 'root' }, propsData) {
  if (!options) return errorComponent(name, 216)
  if (!target) return errorComponent(name, 217)
  const src = { ...options }
  const controller = new AbortController()
  const container = {
    target,
    nodepath: name,
    unmount() {
      controller.abort()
      target.innerHTML = ''
    }
  }
  const component = new InitNode(src, container, {}, controller, withoutComponent)
  const aborted = () => propsData.aborted?.({ phase: component.context.phase, reason: controller.signal.reason })
  const render = () => {
    target.innerHTML = cleanHTML(src.template)
    component.context.container = container
  }
  return await lifecycle(component, render, propsData, aborted)
}

export { mountWidget }