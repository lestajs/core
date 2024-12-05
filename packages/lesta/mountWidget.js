import { lifecycle } from './lifecycle'
import { InitNode } from './initNode'
import withoutComponent from './factoryNode'
import { errorComponent } from '../utils/errors/component'
import { cleanHTML } from '../utils'

async function mountWidget({ options, target, name = 'root', completed, aborted }, app = {}) {
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
  const component = new InitNode(src, container, app, controller, withoutComponent)
  const render = () => {
    if (src.template) target.innerHTML = cleanHTML(src.template)
    component.context.container = container
  }
  return await lifecycle(component, render, {}, () => aborted?.({ phase: component.context.phase, reason: controller.signal.reason }), completed)
}

export { mountWidget }