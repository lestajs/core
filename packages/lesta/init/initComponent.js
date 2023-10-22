import { replicate } from '../../utils/index.js'
import { errorComponent } from '../../utils/errors/component.js'

export default class InitComponent {
  constructor(component, app, signal) {
    this.component = component
    this.app = app
    this.proxiesData = {}
    this.context = {
      ...app.plugins,
      abortSignal: signal,
      options: component,
      container: null,
      node: {},
      param: {},
      method: {},
      proxy: {},
      source: component.sources || {}
    }
  }
  async aborted(stage) {
    if (this.component.aborted) return await this.component.aborted.bind(this.context)(stage)
  }
  async loaded() {
    if (this.component.loaded) return await this.component.loaded.bind(this.context)()
  }
  async rendered() {
    if (typeof this.component !== 'object') return errorComponent(this.context.container.nodepath,211)
    if (this.component.rendered) return await this.component.rendered.bind(this.context)()
  }
  async created() {
    if (this.component.created) return await this.component.created.bind(this.context)()
  }
  methods() {
    if (!this.context.container.method) this.context.container.method = {}
    if (this.component.methods) {
      for (const [key, method] of Object.entries(this.component.methods)) {
        this.context.method[key] = method.bind(this.context)
        this.context.container.method[key] = (...args) => this.context.method[key](...replicate(args))
      }
    }
    Object.preventExtensions(this.context.method)
  }
  params() {
    if (this.component.params) {
      for (const key in this.component.params) {
        if (key in this.context.param) return errorComponent(this.context.container.nodepath, 213, key)
      }
      Object.assign(this.context.param, replicate(this.component.params))
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
}