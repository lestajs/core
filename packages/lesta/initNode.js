import diveProxy from './diveProxy'
import active from './active'
import { errorNode } from '../utils/errors/node'
import impress from './impress'
import * as directives from './directives'
import { errorComponent } from '../utils/errors/component'
import { replicate } from '../utils'

class InitNode {
  constructor(component, container, app, controller, factory) {
    this.factory = factory
    this.component = component
    this.app = app
    this.impress = impress
    this.proxiesData = {}
    this.context = {
      app,
      container,
      options: component,
      phase: 0,
      abort: () => controller.abort(),
      appId: () => {
        app.id++
        return app.name + app.id
      },
      abortSignal: controller.signal,
      node: {},
      param: {},
      method: {},
      proxy: {},
      source: component.sources || {},
      directives: { ...directives, ...app.directives, ...component.directives }
    }
  }
  async loaded(props) {
    await this.component.loaded?.bind(this.context)(props)
  }
  async props() {}
  async rendered() {
    if (typeof this.component !== 'object') return errorComponent(this.context.container.nodepath,211)
    await this.component.rendered?.bind(this.context)()
  }
  async mounted() {
    await this.component.mounted?.bind(this.context)()
  }
  async created() {
    await this.component.created?.bind(this.context)()
  }
  unmounted(container) {
    this.component.unmounted?.bind(this.context)()
    delete container.unmount
  }
  refreshed(v) {
    this.component.refreshed?.bind(this.context)(v)
  }
  methods() {
    if (this.component.methods) {
      for (const [key, method] of Object.entries(this.component.methods)) {
        if (this.context.method.hasOwnProperty(key)) return errorComponent(this.context.container.nodepath, 212, key)
        this.context.method[key] = method.bind(this.context)
        if (this.component.actions?.includes(key)) {
          this.context.container.action[key] = (...args) => {
            const result = method.bind(this.context)(replicate(...args))
            return result instanceof Promise ? result.then(data => replicate(data)) : replicate(result)
          }
        }
      }
    }
    Object.preventExtensions(this.context.container.action)
    Object.preventExtensions(this.context.method)
  }
  params() {
    if (this.component.params) {
      for (const key in this.component.params) {
        if (this.context.param.hasOwnProperty(key)) return errorComponent(this.context.container.nodepath, 213, key)
      }
      Object.assign(this.context.param, this.component.params)
    }
    Object.preventExtensions(this.context.param)
  }
  proxies() {
    if (this.component.proxies) {
      for (const key in this.component.proxies) {
        if (key in this.proxiesData) return errorComponent(this.context.container.nodepath, 214, key)
        this.proxiesData[key] = this.component.proxies[key]
      }
    }
    this.context.proxy = this.getProxy()
    Object.preventExtensions(this.context.proxy)
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
      const nodes = this.component.nodes.bind(this.context)(this.context)
      const container = this.context.container
      const t = container.target
      for (const name in nodes) {
        const s = nodes[name].selector || this.context.app.selectors || `.${name}`
        const selector = typeof s === "function" ? s(name) : s;
        const target = t.querySelector(selector) || t.matches(selector) && t
        const nodepath = container.nodepath + '.' + name
        if (target) {
          if (target._engaged) return errorNode(nodepath, 106, name)
          target._engaged = true
          const c = this.component.styles?.[name]
          if (typeof c === 'string' && c.trim()) {
            target.classList.remove(name)
            target.classList.add(c)
          }
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