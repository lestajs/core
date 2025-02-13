import * as directives from './directives'
import impress from './impress'
import { replicate } from '../utils'
import { errorComponent } from '../utils/errors/component'

export default class InitBasic {
  constructor(component, container, app = {}, controller) {
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
      id: () => {
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
    return await this.component.loaded?.bind(this.context)(props)
  }
  async rendered() {
    if (typeof this.component !== 'object') return errorComponent(this.context.container.nodepath,211)
    return await this.component.rendered?.bind(this.context)()
  }
  async created() {
    return await this.component.created?.bind(this.context)()
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
}