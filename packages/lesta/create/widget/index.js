import { lifecycle } from '../lifecycle'
import { InitBasic } from '../../init/basic'
import NodesBasic from '../../nodes/basic'
import plugins from '../plugins'

async function createWidget(options, root) {
  const component = new InitBasic(options, { plugins }, NodesBasic)
  root.innerHTML = options.template
  await lifecycle(component, root)
  return {
    update(args) {
      component.context.options.updated.bind(component.context)(args)
    },
    destroy() {
      if (root.reactivity) root.reactivity.node.clear()
      root.method = {}
      root.innerHTML = ''
    }
  }
}

export { createWidget }