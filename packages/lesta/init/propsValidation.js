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
  validation(target, prop, key, value, name) {
    const nodepath = this.container.nodepath
    const checkType = (v, t) => v && t && !(typeof v === t || (t === 'array' && Array.isArray(v))) && errorProps(nodepath, name, key, 304, t)
    const checkEnum = (v, e) => v && Array.isArray(e) && (!e.includes(v) && errorProps(nodepath, name, key, 302, v))
    const checkValue = (v, p) => v ?? (p.required && errorProps(nodepath, name, key, 303) || p.default)
    const check = (v, p) => {
      if (typeof p === 'string') return checkType(v, p)
      checkType(v, p.type)
      checkEnum(v, p.enum)
      return checkValue(v, p)
    }
    const variant = {
      string: () => checkType(value, prop),
      object: () => {
        value = check(value, prop)
        prop.validate?.(value, check)
      },
      function: () => prop(value, check)
    }
    variant[typeof prop]?.()
    target[key] = value
    return check
  }
  async proxies(proxies) {
    if (proxies) {
      const proxiesData = {}
      for (const key in proxies) {
        const prop = proxies[key]
        const context = this.context
        let check = null
        this.container.proxy[key] = (value, path) => {
          if (path?.length) {
            deliver(context.proxy[key], path, value)
            prop.validate?.(context.proxy[key], check)
          } else {
            this.validation(context.proxy, prop, key, value, 'proxies')
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
        check = this.validation(proxiesData, prop, key, replicate(value), 'proxies')
      }
      return proxiesData
    }
  }
  async params(params) {
    for (const key in params) {
      const prop = params[key]
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
        return prop?.ignore ? data : replicate(data)
      }
      this.validation(this.context.param, prop, key, await paramValue(), 'params')
      if (prop.readonly) Object.defineProperty(this.context.param, key, { writable: false })
    }
  }
  async methods(methods) {
    for (const key in methods) {
      const prop = methods[key]
      const { store } = prop
      if (store) {
        const storeModule = await this.context.store?.init(store)
        if (!storeModule) return errorProps(this.container.nodepath, 'methods', key, 307, store)
        const method = storeModule.methods(key)
        if (!method) return errorProps(this.container.nodepath, 'methods', key, 305, store)
        this.context.method[key] = async (...args) => await method(...replicate(args))
      } else {
        const isMethodValid = this.props.methods && (key in this.props.methods)
        if (prop?.required && !(isMethodValid)) return errorProps(this.container.nodepath, 'methods', key, 303)
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