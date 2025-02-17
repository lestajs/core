import { replicate, deliver, isObject } from '../utils'
import { errorProps } from '../utils/errors/props'

class Props {
  constructor(props, context, app) {
    this.props = props
    this.context = context
    this.container = context.container
    this.app = app
  }
  async setup(p) {
    if (this.props.proxies && Object.keys(this.props.proxies).length && !p?.proxies) return errorProps(this.container.nodepath, 306)
    this.context.unrelatedProxy = (key) => this.props.proxies[key]?.hasOwnProperty('_independent') ? this.props.proxies[key]._independent : true
    if (p) {
      await this.params(p.params)
      await this.methods(p.methods)
      return await this.proxies(p.proxies)
    }
  }
  prop(p) {
    return typeof p === 'function' ? p.bind(this.context)() : p
  }
  validation(target, prop, key, value, name) {
    const np = this.container.nodepath
    const checkType = (v, t) => v && t && !(typeof v === t || (t === 'array' && Array.isArray(v))) && errorProps(np, name, key, 304, t)
    const checkEnum = (v, e) => v && Array.isArray(e) && (!e.includes(v) && errorProps(np, name, key, 302, v))
    target[key] = value ?? ((prop.required && errorProps(np, name, key, 303)) ?? prop.default ?? value)
    if (typeof prop === 'string') checkType(target[key], prop)
    if (Array.isArray(prop)) checkEnum(target[key], prop)
    if (isObject(prop)) {
      checkType(target[key], prop.type)
      checkEnum(target[key], prop.enum)
      if (prop.validation && !prop.validation.bind(this.context)(target[key])) errorProps(np, name, key, 308)
    }
    return target[key]
  }
  async proxies(proxies) {
    if (proxies) {
      const proxiesData = {}
      const context = this.context
      for (const key in proxies) {
        const prop = this.prop(proxies[key])
        const s = prop.store
        this.container.prop[key] = {
          update: (value, path) => {
            if (path) return deliver(context.proxy[key], path, replicate(value))
            return this.validation(context.proxy, prop, key, replicate(value), 'proxies')
          }
        }
        let value = null
        if (this.props.proxies?.hasOwnProperty(key)) {
          value = this.props.proxies[key]?._value
        } else if (s) {
          const storeModule = await this.app.store?.init(s)
          if (!storeModule) return errorProps(this.container.nodepath, 'proxies', key, 307, s)
          value = storeModule.proxies(key, this.container)
        }
        this.validation(proxiesData, prop, key, replicate(value), 'proxies')
      }
      return proxiesData
    }
  }
  async params(params) {
    for (const key in params) {
      const prop = this.prop(params[key])
      const s = prop.store
      const paramValue = async () => {
        let data = null
        if (s) {
          const storeModule = await this.app.store?.init(s)
          if (!storeModule) return errorProps(this.container.nodepath, 'params', key, 307, s)
          data = storeModule.params(key)
        } else {
          data = this.props?.params[key]
        }
        return prop?.mutable ? data : replicate(data)
      }
      this.validation(this.context.param, prop, key, await paramValue(), 'params')
      if (prop.readonly) Object.defineProperty(this.context.param, key, { writable: false })
    }
  }
  async methods(methods) {
    const setMethod = (method, key) => {
      this.context.method[key] = (...args) => {
        if (args.length && (args.length > 1 || typeof args.at(0) !== 'object')) return errorProps(this.container.nodepath, 'methods', key, 301)
        const result = method(replicate(args.at(0)))
        return result instanceof Promise ? result.then(data => replicate(data)) : replicate(result)
      }
    }
    for (const key in methods) {
      const prop = this.prop(methods[key])
      const s = prop.store
      if (s) {
        const storeModule = await this.app.store?.init(s)
        if (!storeModule) return errorProps(this.container.nodepath, 'methods', key, 307, s)
        const method = storeModule.methods(key)
        if (!method) return errorProps(this.container.nodepath, 'methods', key, 305, s)
        setMethod(method, key)
      } else {
        const isMethodValid = this.props.methods?.hasOwnProperty(key)
        if ((prop?.required || prop === true) && !isMethodValid) return errorProps(this.container.nodepath, 'methods', key, 303)
        if (isMethodValid) setMethod(this.props.methods[key], key)
      }
    }
  }
}

export default {
  init(props, componentProps, context, app) {
    const p = new Props(props, context, app)
    return p.setup(componentProps)
  }
}