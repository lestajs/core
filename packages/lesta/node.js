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
  async controller() {
    for (const key in this.nodeOptions) {
      if (key in this.nodeElement.target) {
        this.native(key)
      } else if (key in this.context.directives) {
        this.directives(key)
      } else if (key === 'component') {
        await this.component?.()
      } else if (key === 'selector') {
        if (this.nodeElement.isSpot) errorNode(this.nodeElement.nodepath, 108)
      } else errorNode(this.nodeElement.nodepath, 104, key)
    }
  }
}