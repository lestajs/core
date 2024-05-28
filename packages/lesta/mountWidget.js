import { lifecycle } from './lifecycle'
import { InitNode } from './initNode'
import withoutComponent from './factoryNode'
import { errorComponent } from '../utils/errors/component'

async function mountWidget({ options, target, name = 'root', aborted, completed }) {
  if (!options) return errorComponent(name, 216)
  if (!target) return errorComponent(name, 217)
  const src = { ...options }
  const controller = new AbortController() // !
  const signal = controller.signal
  const container = { // ???
    target,
    nodepath: name,
    unmount() {
      delete component.context.container
      target.innerHTML = ''
      controller.abort()
    }
  }
  const component = new InitNode(src, container, {}, signal, withoutComponent)
  const render = () => {
    target.innerHTML = src.template
    component.context.container = container
  }
  return await lifecycle(component, render, { aborted, completed })
}

export { mountWidget }