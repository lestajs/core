import InitComponent from '../init/initComponent'
import diveProxy from '../reactivity/diveProxy'
import active from '../reactivity/active'
import * as directives from './directives'
import { errorNode } from '../../utils/errors/node'
import impress from './impress'

class InitBasic extends InitComponent {
  constructor(component, app, signal, Nodes) {
    super(component, app, signal)
    this.Nodes = Nodes
    this.impress = impress
    this.context = {
      ...this.context,
      directives: { ...directives, ...app.directives, ...component.directives }
    }
  }
  async props() {}
  async mounted() {
    this.component.mounted && await this.component.mounted.bind(this.context)()
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
        for (const keyNode in this.context.node) {
          const nodeElement = this.context.node[keyNode]
          active(nodeElement.reactivity.node, ref)
          active(nodeElement.reactivity.component, ref, value)
          for (const section in nodeElement.section) {
            active(nodeElement.section[section]?.reactivity.component, ref, value)
          }
        }
        this.component.handlers?.[ref]?.bind(this.context)(value)
      },
      get: (target, prop, ref) => {
        if (this.impress.collect && !this.impress.refs.includes(ref) && typeof target[prop] !== 'function') {
          this.impress.refs.push(ref)
        }
      }
    })
  }
  async nodes() {
    if (this.component.nodes) {
      const nodes = this.component.nodes.bind(this.context)()
      const container = this.context.container
      for await (const [keyNode, options] of Object.entries(nodes)) {
        const s = options.selector || this.context.selector || `.${keyNode}`
        const selector = typeof s === "function" ? s(keyNode) : s
        const nodeElement = container.querySelector(selector) || container.classList.contains(keyNode) && container
        const nodepath = container.nodepath ? container.nodepath + '.' + keyNode : keyNode
        if (nodeElement) {
          nodeElement.nodepath = nodepath
          nodeElement.nodename = keyNode
          Object.assign(this.context.node, { [keyNode]: nodeElement })
          if (options) {
            const node = new this.Nodes(options, this.context, nodeElement, this.impress, this.app, keyNode)
            for await (const [key] of Object.entries(options)) {
              await node.controller(key)
            }
          }
        } else errorNode(nodepath, 105)
      }
      Object.preventExtensions(this.context.node)
    }
  }
}
export { InitBasic }