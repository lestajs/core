import { errorNode } from '../utils/errors/node'

export default class Node {
  constructor(nodeOptions, context, nodeElement, impress, app) {
    this.app = app
    this.nodeOptions = nodeOptions // options
    this.context = context
    this.impress = impress
    this.nodeElement = nodeElement
    this.nodeElement.reactivity = { node: new Map() }
  }
  reactive(refs, active, reactivity) {
    if (refs?.length) reactivity.set(active, refs)
    this.impress.clear()
    return refs
  }
  reactiveNode(refs, active) {
    this.reactive(refs, active, this.nodeElement.reactivity.node)
  }
  controller() {
    const nodepath = this.nodeElement.nodepath
    const replaced = this.nodeElement.target.tagName === 'TEMPLATE'
    this.nodeElement.replaced = replaced
    for (const key in this.nodeOptions) {
      if (replaced && !['selector', 'component'].includes(key)) return errorNode(nodepath, 108, key)
      if (key in this.nodeElement.target) this.native(key)
      else if (key in this.context.directives) this.directives(key)
      else if (key === 'component') return this.component?.()
      else if (key !== 'selector') return errorNode(nodepath, 104, key)
    }
  }
}