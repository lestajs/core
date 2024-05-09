import { errorComponent } from '../utils/errors/component'
import { mount } from './mount'
import withComponent from './factoryNodeComponent'
import props from './props'

export default {
  async component() {
    this.nodeElement.reactivity.component = new Map()
    if (this.nodeElement.isIterable) return errorComponent(this.nodeElement.nodepath, 208)
    this.nodeElement.mount = async (options) => {
      this.nodeElement.unmount?.()
      this.nodeElement.created = false
      options.iterate ? await this.iterative(options) : await this.basic(options)
    }
    this.nodeOptions.component.async ? this.nodeElement.mount(this.nodeOptions.component) : await this.nodeElement.mount(this.nodeOptions.component)
  },
  induced(fn) {
    if (this.nodeOptions.component.hasOwnProperty('induce')) {
      this.nodeElement.induce = fn
      const induce = this.nodeOptions.component.induce
      if (!induce) return
      if (typeof induce === 'function') {
        this.impress.collect = true
        const permit = induce()
        this.reactiveNode(this.impress.define(), async () => await this.nodeElement.induce(induce()))
        if (!permit) return
      }
    }
    return true
  },
  reactiveComponent(refs, active) {
    return this.reactive(refs, active, this.nodeElement.reactivity.component)
  },
  reactivate(proxies, reactive) {
    const result = {}
    if (proxies) {
      for (const [pr, v] of Object.entries(proxies)) {
        if (typeof v === 'function' && v.name) {
          this.impress.collect = true
          const fn = (nodeElement) => v(nodeElement)
          const value = v(this.nodeElement._current || this.nodeElement)
          const ref = reactive(pr, fn)
          Object.assign(result, { [pr]: { _value: value, _independent: !ref } })
          // this.impress.clear()
        } else Object.assign(result, { [pr]: { _value: v, _independent: true } })
      }
    }
    return result
  },
  async create(proxies, nodeElement, pc) {
    const { src, spots, aborted, completed, ssr } = pc
    // if (!src)
    //   return errorComponent(nodeElement.nodepath, 203); // !
    if (!src) return
    await mount(src, nodeElement, { // ! - container
      aborted,
      completed,
      ssr,
      ...props.collect(pc, nodeElement),
      proxies: proxies(pc.proxies) || {}
    }, this.app)
    this.nodeElement.created = true
    if (!spots) return
    for await (const [name, options] of Object.entries(spots)) {
      if (!nodeElement.spot?.hasOwnProperty(name)) {
        errorComponent(nodeElement.nodepath, 202, name)
        continue
      }
      const spotElement = nodeElement.spot[name]
      Object.assign(spotElement, { parent: nodeElement, nodepath: nodeElement.nodepath + '.' + name, nodename: name, isSpot: true })
      const n = withComponent(options, this.context, spotElement, this.impress, this.app)
      await n.controller()
    }
  }
}