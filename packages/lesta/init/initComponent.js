import { replicate } from '../../utils/index.js'
import { errorComponent } from '../../utils/errors/component.js'

export default class InitComponent {
  constructor(component, app, signal) {
    this.component = component
    this.app = app
    this.proxiesData = {}
    this.context = {
      app,
      phase: 0,
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
  async loaded(props) {
    if (this.component.loaded) return await this.component.loaded.bind(this.context)(props)
  }
  async rendered() {
    if (typeof this.component !== 'object') return errorComponent(this.context.container.nodepath,211)
    if (this.component.rendered) return await this.component.rendered.bind(this.context)()
  }
  async created() {
    if (this.component.created) return await this.component.created.bind(this.context)()
  }
  methods() {
    if (this.component.methods) {
      if (this.component.outwards?.methods?.length) this.context.container.method = {}
      for (const [key, method] of Object.entries(this.component.methods)) {
        if (this.context.method.hasOwnProperty(key)) return errorComponent(this.context.container.nodepath, 212, key)
        this.context.method[key] = method.bind(this.context)
        if (this.component.outwards?.methods?.includes(key)) {
          this.context.container.method[key] = (obj) => {
            const result = method(replicate(obj))
            return result instanceof Promise ? result.then(data => replicate(data)) : replicate(result)
          }
        }
      }
    }
    Object.preventExtensions(this.context.method)
  }
  params() {
    if (this.component.params) {
      if (this.component.outwards?.params?.length) this.context.container.param = {}
      for (const key in this.component.params) {
        if (this.context.param.hasOwnProperty(key)) return errorComponent(this.context.container.nodepath, 213, key)
        if (this.component.outwards?.params?.includes(key)) {
          this.context.container.param[key] = this.component.params[key]
        }
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
}