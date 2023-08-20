import propsValidation from './propsValidation.js'
import { replicate } from '../../utils/index.js'
import { errorComponent } from '../../utils/errors/component.js'

export default class InitComponent {
  constructor(component, app) {
    this.component = component
    this.app = app
    this.proxiesData = {}
    this.context = {
      ...app.plugins,
      options: component,
      container: null,
      node: {},
      param: {},
      method: {},
      proxy: {},
      source: component.sources || {}
    }
    Object.preventExtensions(this.context.source)
  }
  async loaded(container) {
    this.context.container = container
    this.component.loaded && await this.component.loaded.bind(this.context)()
  }
  async created() {
    this.component.created && await this.component.created.bind(this.context)()
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
        this.context.param[key] = this.component.params[key]
      }
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
  async props(props) {
    this.proxiesData = await propsValidation.init(props, this.component.props, this.context, this.context.container, this.app) || {}
  }
}