function mixins(target) {
  if (!target.mixins?.length) return target
  const properties = ['directives', 'params', 'proxies', 'methods', 'handlers', 'setters', 'sources']
  const props = ['params', 'proxies', 'methods']
  const hooks = ['loaded', 'rendered', 'created', 'mounted', 'unmounted']
  const result = { props: {}, actions: [], spots: [] }
  const nodes = []
  const resultNodes = {}
  const mergeProperties = (a, b, key) => {
    return { ...a[key], ...b[key] }
  }
  const mergeArrays = (a, b) => {
    return [ ...a, ...b || [] ]
  }
  const mergeShallow = (a = {}, b = {}) => {
    for (const key in b) {
      a[key] = { ...a[key] || {}, ...b[key] }
    }
    return a
  }
  const mergeOptions = (options) => {
    result.template = options.template || result.template
    result.actions = mergeArrays(result.actions, options.actions)
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
    options.nodes && nodes.push(options.nodes)
  }
  result.nodes = function() {
    nodes.forEach((fn) => {
      mergeShallow(resultNodes, fn.bind(this)())
    })
    return resultNodes
  }
  target.mixins.forEach((options) => {
    mergeOptions(mixins(options))
  })
  mergeOptions(target)
  return result
}

export { mixins }