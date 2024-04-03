import { lifecycle } from './lifecycle'
import { InitBasic } from './init/basic'
import NodesBasic from './nodes/basic'
import { errorComponent } from '../utils/errors/component'

async function mountWidget(src, root, signal, aborted) {
  if (!src) return errorComponent('root', 216)
  if (signal && !(signal instanceof AbortSignal)) errorComponent('root', 217)
  if (aborted && typeof aborted !== 'function') errorComponent('root', 218)
  const component = new InitBasic(src, {}, signal, NodesBasic)
  const render = () => {
    root.innerHTML = src.template
    component.context.container = root
  }
  await lifecycle(component, render, aborted)
  return {
    destroy() {
      delete root.reactivity
      delete root.method
      root.innerHTML = ''
    }
  }
}

export { mountWidget }