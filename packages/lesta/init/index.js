import { InitBasic } from './basic'
import propsValidation from './propsValidation'

class Init extends InitBasic {
  constructor(...args) {
    super(...args)
  }
  async props() {
    this.proxiesData = await propsValidation.init(this.context.options.inputs, this.component.props, this.context, this.app) || {}
  }
  destroy(container) {
    // if (container.reactivity) container.reactivity.component.clear() // !!
    delete container.proxy
    delete container.method
    for (const key in container.unstore) {
      container.unstore[key]()
    }
  }
  unmount(container) {
    if (this.context.node) {
      for (const node of Object.values(this.context.node)) {
        if (node.unmount && !node.hasAttribute('iterable')) {
          if (node.section) {
            for (const section of Object.values(node.section)) {
              section.unmount && section.unmount()
            }
          }
          node.unmount()
        }
        if (node.directives) {
          for (const directive of Object.values(node.directives)) {
            directive.destroy && directive.destroy()
          }
        }
        // if (node.reactivity) node.reactivity.node.clear() // !!
      }
    }
    this.component.unmounted && this.component.unmounted.bind(this.context)()
    delete container.unmount
  }
}
export { Init }