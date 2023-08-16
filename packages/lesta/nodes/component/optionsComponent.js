import { loadModule } from '../../../utils/loadModule.js'

export default {
  async props(component, proxies, val, index) {
    return {
      proxies: this.proxies(proxies),
      params: this.params(component.params, val, index),
      methods: this.methods(component.methods),
      section: component.section
    }
  },
  proxies(proxies) {
    if (proxies) {
      return proxies || {}
    }
  },
  methods(methods) {
    const result = {}
    if (methods) {
      for (const [pr, v] of Object.entries(methods)) {
        if (typeof v === 'function') {
          Object.assign(result, { [pr]: v })
        }
      }
    } return result
  },
  params(params, val, index) {
    const result = {}
    if (params) {
      for (const [pr, fn] of Object.entries(params)) {
        let data = null
        if (typeof fn === 'function' && fn.name) {
          data = val ? fn(val, index) : fn()
        } else data = fn
        Object.assign(result, { [pr]: data })
      }
    } return result
  },
  async collect(component, proxies, val, index) {
    const props = await this.props(component, proxies, val, index)
    const options = await loadModule(component.src)
    return { options, props }
  }
}
