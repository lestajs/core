import { errorNode } from '../utils/errors/node'

export default {
  listeners(key) {
    if (typeof this.nodeOptions[key] === 'function') {
      this.nodeElement.target[key] = (event) => this.nodeOptions[key].bind(this.context)(event)
    }
  },
  general(key) {
    if (key === 'innerHTML') return errorNode(this.nodeElement.nodepath, 106)
    if (typeof this.nodeOptions[key] === 'function') {
      const active = () => {
        const val = this.nodeOptions[key].bind(this.context)()
        if (this.nodeElement.target[key] !== null && typeof this.nodeElement.target[key] === 'object') {
          val !== null && typeof val === 'object' ? Object.assign(this.nodeElement.target[key], val) : errorNode(this.nodeElement.nodepath, 103, key)
        } else this.nodeElement.target[key] = val
      }
      this.impress.collect = true
      active()
      this.reactiveNode(this.impress.define(), active)
    } else this.nodeElement.target[key] = this.nodeOptions[key]
  },
  native(key) {
    key.startsWith('on') ? this.listeners(key) : this.general(key)
  }
}