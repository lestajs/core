import { lifecycle } from './lifecycle'
import { InitNode } from './initNode'
import withoutComponent from './factoryNode'
import { errorComponent } from '../utils/errors/component'
import templateToHTML from './templateToHTML'

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
    component.context.container = container
    if (src.template) target.append(...templateToHTML(src.template, component.context))
  }
  return await lifecycle(component, render, {}, () => aborted?.({ phase: component.context.phase, reason: controller.signal.reason }), completed)
}

export { mountWidget }