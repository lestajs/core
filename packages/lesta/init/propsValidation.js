import deliver from '../reactivity/deliver.js'
import { replicate } from '../../utils/index.js'
import { errorProps } from '../../utils/errors/props.js'

class Props {
  constructor(props, context, container, app) {
    this.props = props
    this.context = context
    this.container = container
    this.app = app
  }
  async setup(componentProps) {
    if (this.props.proxies && Object.keys(this.props.proxies).length && !componentProps?.proxies) return errorProps(this.container.nodepath, 306)
    if (!this.container.proxy) this.container.proxy = {}
    if (componentProps) {
      await this.params(componentProps.params)
      await this.methods(componentProps.methods)
      return await this.proxies(componentProps.proxies)
    }
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
        const validation = (v) => {
          if (prop.required && (v === null || v === undefined)) return errorProps(this.container.nodepath, 'proxies', key, 303)
          const value = v ?? prop.default ?? null
          if (value && prop.type && (prop.type === 'array' && !Array.isArray(value)) && typeof value !== prop.type) return errorProps(this.container.nodepath, 'proxies', key, 304, prop.type)
          return value
        }
        const context = this.context
        this.container.proxy[key] = (value, path) => {
          if (path && path.length !== 0) {
            deliver(context.proxy[key], path, value)
          } else {
            context.proxy[key] = validation(value)
          }
        }
        let v = null
        const { store } = prop
        if (this.props.proxies && key in this.props.proxies) {
          v = this.props.proxies[key]
        } else if (store) {
          const storeModule = await this.context.store.get(store)
          if (!storeModule) return errorProps(this.container.nodepath, 'proxies', key, 307, store)
          v = storeModule.proxies(key, this.container)
        }
        proxiesData[key] = replicate(validation(v))
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
        if (store) {
          const storeModule = await this.context.store.get(store)
          if (!storeModule) return errorProps(this.container.nodepath, 'params', key, 307, store)
          const storeParams = storeModule.params(key)
          return replicate(storeParams)
        } else {
          const data = this.props?.params[key]
          const isDataValid =
            data instanceof Promise ||
            data instanceof HTMLCollection ||
            data instanceof NodeList ||
            data instanceof Element ||
            key.startsWith('__')
          return isDataValid ? data : replicate(data)
        }
      }
      const value = this.context.param[key] = await paramValue() ??
        ((prop.required && errorProps(this.container.nodepath, 'params', key, 303)) ||
          prop.default)
      if (value && prop.type && (prop.type === 'array' && !Array.isArray(value)) && typeof value !== prop.type)
        errorProps(this.container.nodepath, 'params', key, 304, prop.type)
      if (prop.readonly)
        Object.defineProperty(this.context.param, key, { writable: false })
    }
  }
  async methods(methods) {
    for (const key in methods) {
      const prop = methods[key]
      if (typeof prop !== 'object') return errorProps(this.container.nodepath, 'methods', key, 302)
      const { store } = prop
      if (store) {
        const storeModule = await this.context.store.get(store)
        if (!storeModule) return errorProps(this.container.nodepath, 'methods', key, 307, store)
        const method = storeModule.methods(key)
        if (!method) return errorProps(this.container.nodepath, 'methods', key, 305, store)
        this.context.method[key] = (...args) => method(...replicate(args))
      } else {
        const isMethodValid = this.props.methods && (key in this.props.methods)
        if (prop.required && !(isMethodValid)) return errorProps(this.container.nodepath, 'methods', key, 303)
        if (isMethodValid) this.context.method[key] = (...args) => {
          this.props.methods[key](...replicate(args))
        }
      }
    }
  }
}

export default {
  async init(props, componentProps, context, container, app) {
    const p = new Props(props, context, container, app)
    return await p.setup(componentProps)
  }
}