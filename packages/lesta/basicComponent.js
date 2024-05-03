export default {
  async basic(options) {
    this.nodeOptions.component = options
    const mount = async () => await this.create(this.proxies.bind(this), this.nodeElement, options)
    const induced = this.induced(async (permit) => permit ? await mount() : this.nodeElement.unmount?.())
    if (induced) await mount()
  },
  proxies(proxies) { // ! - target
    if (!proxies) return
    const reactive = (pr, fn) => this.reactiveComponent(this.impress.define(pr), (v, p) => {
      p ? this.nodeElement.proxy?.[pr]?.setValue(v, p) : this.nodeElement.proxy?.[pr]?.setValue(fn(this.nodeElement)) // ! ?.
    }) // !- target
    return this.reactivate(proxies, reactive) // ! - this.nodeElement
  }
}