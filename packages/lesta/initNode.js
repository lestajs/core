import InitBasic from './initBasic'
import diveProxy from './diveProxy'
import active from './active'
import { errorNode } from '../utils/errors/node'

class InitNode extends InitBasic {
  constructor(component, container, app, signal, factory) {
    super(component, container, app, signal)
    this.factory = factory
  }
  async props() {}
  async mounted() {
    await this.component.mounted?.bind(this.context)()
  }
  actives(nodeElement, ref) {
    active(nodeElement.reactivity?.node, ref)
  }
  getProxy() {
    return diveProxy(this.proxiesData, {
      beforeSet: (value, ref, callback) => {
        if (this.component.setters?.[ref]) {
          const v = this.component.setters[ref].bind(this.context)(value)
          if (v === undefined) return true
          callback(v)
        }
      },
      set: (target, value, ref) => {
        for (const name in this.context.node) {
          this.actives(this.context.node[name], ref, value)
        }
        this.component.handlers?.[ref]?.bind(this.context)(value)
      },
      get: (target, prop, ref) => {
        if (this.impress.collect && !this.impress.refs.includes(ref) && target.hasOwnProperty(prop)) {
          this.impress.refs.push(ref)
        }
      }
    })
  }
  async nodes() {
    if (this.component.nodes) {
      const nodes = this.component.nodes.bind(this.context)()
      const container = this.context.container
      const t = container.target
      for (const name in nodes) {
        const s = nodes[name].selector || this.context.app.selector || `.${name}`
        const selector = typeof s === "function" ? s(name) : s;
        const target = t.querySelector(selector) || t.matches(selector) && t
        const nodepath = container.nodepath + '.' + name
        if (target) {
          if (target._engaged) return errorNode(nodepath, 106, name)
          target._engaged = true
          if (container.spot && Object.values(container.spot).includes(target)) {
            errorNode(nodepath, 107, name)
            continue
          }
          Object.assign(this.context.node, { [name]: { target, nodepath: nodepath, nodename: name, action: {}, prop: {}, directives: {} }});
        } else errorNode(nodepath, 105);
      }
      Object.preventExtensions(this.context.node)
      for await (const [name, nodeElement] of Object.entries(this.context.node)) {
        const n = this.factory(nodes[name], this.context, nodeElement, this.impress, this.app)
        await n.controller()
      }
    }
  }
}
export { InitNode }