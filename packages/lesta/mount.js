import { errorComponent } from '../utils/errors/component'
import { loadModule } from '../utils'
import { InitNodeComponent } from './initNodeComponent'
import { mixins } from './mixins'
import withComponent from './factoryNodeComponent'
import renderComponent from './renderComponent'
import { lifecycle } from './lifecycle'

async function mount(module, container, props, app = {}) {
  const controller = new AbortController()
  const signal = controller.signal
  const options = await loadModule(module, signal)
  if (!options) return errorComponent(container.nodepath, 216)
  const component = new InitNodeComponent(mixins(options), container, app, signal, withComponent)
  const render = () => renderComponent(container, component, controller)
  return await lifecycle(component, render, props)
}

export { mount }