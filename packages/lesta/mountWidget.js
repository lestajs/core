import { lifecycle } from './lifecycle'
import { InitNode } from './initNode'
import withoutComponent from './factoryNode'
import { errorComponent } from '../utils/errors/component'
import templateToHTML from './templateToHTML'

async function mountWidget({ options, target, name = 'root' }, app = {}) {
  if (!options) return errorComponent(name, 216)
  if (!target) return errorComponent(name, 217)
  const src = { ...options }
  const controller = new AbortController()
  const container = {
    target,
    nodepath: name,
    action: {},
    unmount() {
      controller.abort()
      target.innerHTML = ''
      component.component.unmounted?.bind(component.context)()
      delete container.unmount;
    }
  }
  const aborted = () => app.aborted?.({ phase: component.context.phase, reason: controller.signal.reason })
  const component = new InitNode(src, container, app, controller, withoutComponent)
  const render = () => {
    component.context.container = container
    if (src.template) target.append(...templateToHTML(src.template, component.context))
  }
  return await lifecycle(component, render, aborted, app.completed)
}

export { mountWidget }