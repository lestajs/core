import { errorNode } from '../utils/errors/node'

export default {
  listeners(key) {
    if (typeof this.nodeOptions[key] === 'function') {
      this.nodeElement.target[key] = (event) => this.nodeOptions[key].bind(this.context)(event)
    }
  },
  general(key) {
    const set = (v) => {
      if (this.nodeElement.target[key] !== null && typeof this.nodeElement.target[key] === 'object') {
        v !== null && typeof v === 'object' ? Object.assign(this.nodeElement.target[key], v) : errorNode(this.nodeElement.nodepath, 103, key)
      } else this.nodeElement.target[key] = v
    }
    if (typeof this.nodeOptions[key] === 'function') {
      const active = () => set(this.nodeOptions[key].bind(this.context)())
      this.impress.collect = true
      active()
      this.reactiveNode(this.impress.define(), active)
    } else set(this.nodeOptions[key])
  },
  native(key) {
    key.startsWith('on') ? this.listeners(key) : this.general(key)
  }
}