export default {
  collect(propertyComponent, nodeElement) {
    return {
      params: this.params(propertyComponent.params, nodeElement),
      methods: this.methods(propertyComponent.methods)
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
  params(params, nodeElement) {
    const result = {}
    if (params) {
      for (const [pr, v] of Object.entries(params)) {
        Object.assign(result, { [pr]: (typeof v === 'function' && v.name) ? v(nodeElement) : v })
      }
    } return result
  }
}
