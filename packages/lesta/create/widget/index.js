import { lifecycle } from '../lifecycle'
import { errorNode } from '../../../utils/errors/node'
import { InitBasic } from '../../init/basic'
import NodesBasic from '../../nodes/basic'

async function createWidget(options, root) {
  const component = new InitBasic(options, { errorNode }, NodesBasic)
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