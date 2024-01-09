export default {
  collect(propertyComponent, proxies, val, index) {
    return {
      params: this.params(propertyComponent.params, val, index),
      methods: this.methods(propertyComponent.methods),
      proxies: this.proxies(proxies),
      section: propertyComponent.section
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
  }
}
