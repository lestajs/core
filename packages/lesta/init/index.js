import { InitBasic } from './basic'
import propsValidation from './propsValidation'

class Init extends InitBasic {
  constructor(...args) {
    super(...args)
  }
  async props(props) {
    this.proxiesData = await propsValidation.init(props, this.component.props, this.context, this.app) || {}
  }
  destroy(container) {
    // if (container.reactivity) container.reactivity.component.clear() // !!
    delete container.proxy
    delete container.method
    for (const key in container.unstore) {
      container.unstore[key]()
    }
    delete container.unmount
  }
  async unmount() {
    if (this.context.node) {
      for await (const node of Object.values(this.context.node)) {
        if (node.unmount && !node.hasAttribute('iterable')) {
          if (node.section) {
            for await (const section of Object.values(node.section)) {
              await section.unmount && section.unmount()
            }
          }
          await node.unmount()
        }
        if (node.directives) {
          for await (const directive of Object.values(node.directives)) {
            directive.destroy && directive.destroy()
          }
        }
        // if (node.reactivity) node.reactivity.node.clear() // !!
      }
    }
    this.component.unmounted && await this.component.unmounted.bind(this.context)()
  }
}
export { Init }