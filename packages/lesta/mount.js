import { errorComponent } from '../utils/errors/component'
import { loadModule } from '../utils'
import { InitNodeComponent } from './initNodeComponent'
import { mixins } from './mixins'
import withComponent from './factoryNodeComponent'
import renderComponent from './renderComponent'
import { lifecycle } from './lifecycle'

async function mount(module, container, propsData = {}, app = {}) {
  const controller = new AbortController()
  container.unmount = () => controller.abort()
  const aborted = () => propsData.aborted?.({ phase: component ? component.context.phase : 0, reason: controller.signal.reason })
  const options = await loadModule(module, controller.signal, aborted)
  if (!options) return errorComponent(container.nodepath, 216)
  const component = new InitNodeComponent(mixins(options), container, app, controller, withComponent)
  const render = () => renderComponent(container, component)
  return await lifecycle(component, render, propsData, aborted, propsData.completed)
}

export { mount }