import Components from '../index'

export default class Basic extends Components {
  constructor(...args) {
    super(...args)
  }
  async init() {
    const mount = async (pc) => await this.create(this.proxies.bind(this), this.nodeElement, pc, () => this.proxies(pc.proxies, this.nodeElement))
    const induced = this.induced(async (permit) => {
      if (!permit) {
        this.nodeElement.unmount?.()
      } else if (!this.nodeElement.unmount) await mount(this.node.component)
    })
    if (induced) await mount(this.node.component)
  }
  proxies(proxies, target) {
    const reactive = (pr, fn) => this.reactiveComponent(this.impress.define(pr), (v, p) => p ? target.proxy[pr]?.setValue(v, p) : target.proxy[pr]?.setValue(fn()), target)
    return this.reactivate(proxies, reactive, null, null, target)
  }
}