import { errorComponent } from '../utils/errors/component'
import { mount } from './mount'
import withComponent from './factoryNodeComponent'
import props from './props'

export default {
  async component() {
    this.nodeElement.reactivity.component = new Map()
    if (this.nodeElement.iterated) return errorComponent(this.nodeElement.nodepath, 208)
    this.nodeElement.mount = (options) => {
      this.nodeElement.unmount?.()
      this.nodeElement.created = false
      return options.iterate ? this.iterative(options) : this.basic(options)
    }
    const mount = () => this.nodeElement.mount(this.nodeOptions.component)
    this.nodeOptions.component.async ? mount() : await mount()
  },
  induced(fn) {
    if (this.nodeOptions.component.hasOwnProperty('induced')) {
      this.nodeElement.induced = fn
      const induced = this.nodeOptions.component.induced
      if (!induced) return
      if (typeof induced === 'function') {
        this.impress.collect = true
        const permit = induced()
        this.reactiveNode(this.impress.define(), async () => await this.nodeElement.induced(induced()))
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
          Object.assign(result, { [pr]: { _value: value, _independent: !reactive(pr, fn) } })
          // this.impress.clear()
        } else Object.assign(result, { [pr]: { _value: v, _independent: true } })
      }
    }
    return result
  },
  async create(proxies, nodeElement, pc) {
    const { src, spots, aborted, completed } = pc
    if (!src) return
    await mount(src, nodeElement, {
      aborted,
      completed,
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
      Object.assign(spotElement, { parent: nodeElement, nodepath: nodeElement.nodepath + '.' + name, nodename: name, action: {}, prop: {}, spoted: true })
      const n = withComponent(options, this.context, spotElement, this.impress, this.app)
      await n.controller()
    }
  }
}