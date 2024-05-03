function mixins(target) {
  if (target.mixins?.length) {
    const properties = ['directives', 'params', 'proxies', 'methods', 'handlers', 'setters', 'sources']
    const props = ['params', 'proxies', 'methods']
    const hooks = ['loaded', 'rendered', 'created', 'mounted', 'unmounted']
    const result = { props: {}, outwards: { params: [], methods: [] }, spots: [] }
    const mergeProperties = (a, b, key) => {
      return { ...a[key], ...b[key] }
    }
    const mergeArrays = (a, b) => {
      return [ ...a, ...b || [] ]
    }
    const mergeOptions = (options) => {
      result.template = options.template || result.template
      result.outwards.params = mergeArrays(result.outwards.params, options.outwards?.params)
      result.outwards.methods = mergeArrays(result.outwards.methods, options.outwards?.methods)
      result.spots = mergeArrays(result.spots, options.spots)
      properties.forEach((key) => {
        result[key] = mergeProperties(result, options, key)
      })
      hooks.forEach((key) => {
        const resultHook = result[key]
        result[key] = async function() {
          return options[key]?.bind(this)() || resultHook?.bind(this)()
        }
      })
      props.forEach((key) => {
        result.props[key] = mergeProperties(result.props, options.props || {}, key)
      })
      const resultNodes = result.nodes
      result.nodes = function () {
        return {
          ...resultNodes?.bind(this)(),
          ...options.nodes?.bind(this)()
        }
      }
    }
    target.mixins.forEach((options) => {
      mergeOptions(mixins(options))
    })
    mergeOptions(target)
    return result
  }
  return target
}

export { mixins }