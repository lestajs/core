const _intersection = {
  create: (node, options, directive) => {
    const observer = new IntersectionObserver(options.callback, {
      rootMargin: options.rootMargin || "0px",
      threshold: options.threshold || 1.0
    })
    observer.observe(node)
  }
}

// _intersection: {
//   callback: (entries) => entries.at(0).isIntersecting && this.method.more()
// }

export { _intersection }