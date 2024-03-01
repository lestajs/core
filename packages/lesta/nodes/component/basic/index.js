import Components from '../index'
import { errorComponent } from '../../../../utils/errors/component'

export default class Basic extends Components {
  constructor(...args) {
    super(...args)
  }
  async init() {
    const mount = async (pc) => await this.create(this.proxies.bind(this), this.nodeElement, pc, this.proxies(pc.proxies, this.nodeElement))
    this.nodeElement.mount = mount
    if (this.node.component.induce) {
      if (typeof this.node.component.induce !== 'function') return errorComponent(this.nodeElement.nodepath, 212)
      this.impress.collect = true
      const permit = this.node.component.induce()
      this.reactiveNode(this.impress.define(), async () => {
        if (!this.node.component.induce()) {
          this.nodeElement.unmount?.()
        } else if (!this.nodeElement.unmount) await mount(this.node.component)
      })
      if (permit) await mount(this.node.component)
    } else {
      this.node.component.src && await mount(this.node.component)
    }
  }
  proxies(proxies, target) {
    const reactive = (pr, fn) => this.reactiveComponent(this.impress.define(pr), (v, p) => p ? target.proxy[pr]?.(v, p) : target.proxy[pr]?.(fn()), target)
    return this.reactivate(proxies, reactive, null, null, target)
  }
}