function mixins(target) {
  if (target.mixins?.length) {
    const properties = ['directives', 'params', 'proxies', 'methods', 'handlers', 'setters', 'sources']
    const props = ['params', 'proxies', 'methods']
    const outwards = ['params', 'methods']
    const hooks = ['loaded', 'rendered', 'created', 'mounted', 'unmounted']
    const result = { props: {}, outwards: { params: [], methods: [] }, spots: [] }
    const mergeProperties = (a, b, key) => {
      return { ...a[key], ...b[key] }
    }
    const mergeArrays = (a, b) => {
      return [ ...a, ...b || [] ]
    }
    const mergeShallow = (a = {}, b = {}) => {
      const obj = {}
      for (const key in b) {
        obj[key] = { ...(a[key] || {}), ...b[key] }
      }
      return obj
    }
    const mergeOptions = (options) => {
      result.template = options.template || result.template
      outwards.forEach(key => {
        result.outwards[key] = mergeArrays(result.outwards[key], options.outwards?.[key]);
      })
      result.spots = mergeArrays(result.spots, options.spots)
      properties.forEach((key) => {
        result[key] = mergeProperties(result, options, key)
      })
      hooks.forEach((key) => {
        if (options[key]) result[key] = options[key]
      })
      props.forEach((key) => {
        result.props[key] = mergeProperties(result.props, options.props || {}, key)
      })
      const resultNodes = result.nodes
      result.nodes = function () {
        return mergeShallow(resultNodes?.bind(this)(), options.nodes?.bind(this)())
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