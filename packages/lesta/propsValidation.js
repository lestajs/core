import { deliver } from '../utils/deliver.js'
import { replicate } from '../utils'
import { errorProps } from '../utils/errors/props.js'

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
    const checkValue = (v, p) => v ?? ((p.required && errorProps(nodepath, name, key, 303)) ?? p.default ?? v)
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
      const context = this.context
      for (const key in proxies) {
        const prop = proxies[key]
        let check = null
        this.container.proxy[key] = {
          getValue: () => replicate(context.proxy[key]),
          setValue: (value, path) => {
            if (path) {
              deliver(context.proxy[key], path, replicate(value))
              prop.validate?.(context.proxy[key], check)
            } else {
              this.validation(context.proxy, prop, key, replicate(value), 'proxies')
            }
          },
          isIndependent: () => this.props.proxies[key]?.hasOwnProperty('_independent') ? this.props.proxies[key]._independent : true
        }
        let value = null
        const { store } = prop
        if (this.props.proxies?.hasOwnProperty(key)) {
          value = this.props.proxies[key]?._value
        } else if (store) {
          const storeModule = await this.app.store?.init(store)
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
          const storeModule = await this.app.store?.init(store)
          if (!storeModule) return errorProps(this.container.nodepath, 'params', key, 307, store)
          data = storeModule.params(key)
        } else {
          data = this.props?.params[key]
        }
        return prop?.hole ? data : replicate(data)
      }
      this.validation(this.context.param, prop, key, await paramValue(), 'params')
      if (prop.readonly) Object.defineProperty(this.context.param, key, { writable: false })
    }
  }
  async methods(methods) {
    const setMethod = (method, key) => {
      this.context.method[key] = (...args) => {
        if (args.length && (args.length > 1 || typeof args.at(0) !== 'object')) return errorProps(this.container.nodepath, 'methods', key, 301)
        const result = method({ ...replicate(args.at(0)), _params: this.context.container.param, _methods: this.context.container.method })
        return result instanceof Promise ? result.then(data => replicate(data)) : replicate(result)
      }
    }
    for (const key in methods) {
      const prop = methods[key]
      const { store } = prop
      if (store) {
        const storeModule = await this.app.store?.init(store)
        if (!storeModule) return errorProps(this.container.nodepath, 'methods', key, 307, store)
        const method = storeModule.methods(key)
        if (!method) return errorProps(this.container.nodepath, 'methods', key, 305, store)
        setMethod(method, key)
      } else {
        const isMethodValid = this.props.methods?.hasOwnProperty(key)
        if (prop?.required && !(isMethodValid)) return errorProps(this.container.nodepath, 'methods', key, 303)
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