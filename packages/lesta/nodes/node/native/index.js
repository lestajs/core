import Node from '../../node.js'
import { errorNode } from '../../../../utils/errors/node'

export default class Native extends Node {
  constructor(...args) {
    super(...args)
  }
  listeners(key) {
    if (typeof this.node[key] === 'function') {
      this.nodeElement[key] = (event) => this.node[key].bind(this.context)(event, this.nodeElement)
    }
  }
  general(key) {
    if (key === 'innerHTML') return errorNode(this.nodeElement.nodepath, 106)
    if (typeof this.node[key] === 'function') {
      const active = () => {
        const val = this.node[key].bind(this.context)(this.nodeElement)
        if (this.nodeElement[key] !== null && typeof this.nodeElement[key] === 'object') {
          val !== null && typeof val === 'object' ? Object.assign(this.nodeElement[key], val) : errorNode(this.nodeElement.nodepath, 103, key)
        } else this.nodeElement[key] = (val !== Object(val)) ? val : JSON.stringify(val)
      }
      this.impress.collect = true
      active()
      this.reactiveNode(this.impress.define(), active)
    } else this.nodeElement[key] = this.node[key]
  }
  init(key) {
    key.startsWith('on') ? this.listeners(key) : this.general(key)
  }
}