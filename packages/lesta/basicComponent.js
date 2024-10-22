export default {
  async basic(options) {
    this.nodeOptions.component = options
    const create = () => this.create(this.proxies.bind(this), this.nodeElement, options)
    const induced = this.induced(async (permit) => permit ? await create() : this.nodeElement.unmount?.())
    if (induced) await create()
  },
  proxies(proxies) {
    if (!proxies) return
    const reactive = (pr, fn) => this.reactiveComponent(this.impress.define(pr), (v, p) => {
      const setValue = (...arg) => this.nodeElement.proxy?.[pr]?.setValue(...arg)
      p ? setValue(v, p) : setValue(fn(this.nodeElement)) // ! ?.
    })
    return this.reactivate(proxies, reactive) // ! - this.nodeElement
  }
}