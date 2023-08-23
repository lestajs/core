import InitComponent from '../init/initComponent'
import diveProxy from '../reactivity/diveProxy'
import active from '../reactivity/active'
import { _html, _evalHTML, _class, _text } from './directives'
import { errorNode } from '../../utils/errors/node'
import impress from './impress'

class InitBasic extends InitComponent {
  constructor(component, app, Nodes) {
    super(component, app)
    this.Nodes = Nodes
    this.impress = impress
    this.context = {
      ...this.context,
      exclude: this.impress.exclude.bind(this.impress),
      directives: { _html, _evalHTML, _class, _text, ...app.directives, ...component.directives },
      root: app.root
    }
  }
  async mounted() {
    this.context.source.stylesheet && await this.context.source.stylesheet()
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
          nodeElement.reactivity.node && active(nodeElement.reactivity.node, ref)
          nodeElement.reactivity.component && active(nodeElement.reactivity.component, ref, value)
          for (const section in nodeElement.section) {
            nodeElement.section[section]?.reactivity.component && active(nodeElement.section[section].reactivity.component, ref, value)
          }
        }
        this.component.handlers?.[ref]?.bind(this.context)(value)
      },
      get: (target, ref) => {
        if (this.impress.collect && !this.impress.refs.includes(ref)) {
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
        const selector = (this.component.selectors && this.component.selectors[keyNode] ) || `.${keyNode}`
        const nodeElement = container.querySelector(selector) || container.classList.contains(keyNode) && container
        if (!nodeElement) return errorNode(keyNode, 105)
        nodeElement.nodepath = container.nodepath ? container.nodepath + '.' + keyNode : keyNode
        nodeElement.nodename = keyNode
        Object.assign(this.context.node, { [keyNode]: nodeElement })
        if (options) {
          const node = new this.Nodes(options, this.context, nodeElement, this.impress, this.app, keyNode)
          for await (const [key] of Object.entries(options)) {
            await node.controller(key)
          }
        }
      }
      Object.preventExtensions(this.context.node)
    }
  }
}
export { InitBasic }