function mixins(target) {
  if (target.mixins?.length) {
    const properties = ['selectors', 'directives', 'params', 'proxies', 'methods', 'handlers', 'setters', 'sources']
    const props = ['params', 'proxies', 'methods']
    const hooks = ['loaded', 'rendered', 'created', 'mounted', 'unmounted']
    const result = { props: {} }
    const mergeProperties = (a, b, key) => {
      return { ...a[key], ...b[key] }
    }
    const mergeOptions = (options) => {
      result.template = options.template || result.template
      properties.forEach((key) => {
        result[key] = mergeProperties(result, options, key)
      })
      hooks.forEach((key) => {
        const resultHook = result[key]
        result[key] = async function () {
          let data = await resultHook?.bind(this)()
          if (!data) data = await options[key]?.bind(this)()
          return data
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