import { deliver } from '../../utils/deliver.js'
import { replicate } from '../../utils/index.js'
import { errorProps } from '../../utils/errors/props.js'

class Props {
  constructor(props, context, app) {
    this.props = props
    this.context = context
    this.container = context.container
    this.app = app
  }
  async setup(cp) {
    if (this.props.proxies && Object.keys(this.props.proxies).length && !cp?.proxies) return errorProps(this.container.nodepath, 306)
    if (!this.container.proxy) this.container.proxy = {}
    if (cp) {
      await this.params(cp.params)
      await this.methods(cp.methods)
      return await this.proxies(cp.proxies)
    }
  }
  validation(prop, key, v, name) {
    let value = typeof prop.validation === 'function' ? prop.validation(v) : v
    value = value ?? ((prop.required && errorProps(this.container.nodepath, name, key, 303)) || prop.default)
    if (value && prop.type && (prop.type === 'array' && !Array.isArray(value)) && typeof value !== prop.type) return errorProps(this.container.nodepath, name, key, 304, prop.type)
    return value
  }
  async proxies(proxies) {
    if (proxies) {
      for (const key in this.props.proxies) {
        if (!(proxies.hasOwnProperty(key))) return errorProps(this.container.nodepath, 'proxies', key, 301)
      }
      const proxiesData = {}
      for (const key in proxies) {
        const prop = proxies[key]
        if (typeof prop !== 'object') return errorProps(this.container.nodepath, 'proxies', key, 302)
        
        const context = this.context
        this.container.proxy[key] = (value, path) => {
          if (path && path.length !== 0) {
            deliver(context.proxy[key], path, value)
          } else {
            context.proxy[key] = this.validation(prop, key, value, 'proxies')
          }
        }
        let value = null
        const { store } = prop
        if (this.props.proxies && key in this.props.proxies) {
          value = this.props.proxies[key]
        } else if (store) {
          const storeModule = await this.context.store?.init(store)
          if (!storeModule) return errorProps(this.container.nodepath, 'proxies', key, 307, store)
          value = storeModule.proxies(key, this.container)
        }
        proxiesData[key] = this.validation(prop, key, replicate(value), 'proxies')
      }
      return proxiesData
    }
  }
  async params(params) {
    for (const key in params) {
      const prop = params[key]
      if (typeof prop !== 'object') return errorProps(this.container.nodepath, 'params', key, 302)
      const paramValue = async () => {
        const { store } = prop
        let data = null
        if (store) {
          const storeModule = await this.context.store?.init(store)
          if (!storeModule) return errorProps(this.container.nodepath, 'params', key, 307, store)
          data = storeModule.params(key)
        } else {
          data = this.props?.params[key]
        }
        return prop.ignore ? data : replicate(data)
      }
      this.context.param[key] = this.validation(prop, key, await paramValue(), 'params')
      if (prop.readonly) Object.defineProperty(this.context.param, key, { writable: false })
    }
  }
  async methods(methods) {
    for (const key in methods) {
      const prop = methods[key]
      if (typeof prop !== 'object') return errorProps(this.container.nodepath, 'methods', key, 302)
      const { store } = prop
      if (store) {
        const storeModule = await this.context.store?.init(store)
        if (!storeModule) return errorProps(this.container.nodepath, 'methods', key, 307, store)
        const method = storeModule.methods(key)
        if (!method) return errorProps(this.container.nodepath, 'methods', key, 305, store)
        this.context.method[key] = async (...args) => await method(...replicate(args))
      } else {
        const isMethodValid = this.props.methods && (key in this.props.methods)
        if (prop.required && !(isMethodValid)) return errorProps(this.container.nodepath, 'methods', key, 303)
        if (isMethodValid) this.context.method[key] = async (...args) => await this.props.methods[key](...replicate(args))
      }
    }
  }
}

export default {
  async init(props, componentProps, context, app) {
    const p = new Props(props, context, app)
    return await p.setup(componentProps)
  }
}