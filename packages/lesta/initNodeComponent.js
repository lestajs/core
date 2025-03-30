import { InitNode } from './initNode'
import propsValidation from './propsValidation'
import active from './active'

class InitNodeComponent extends InitNode {
  constructor(...args) {
    super(...args)
  }
  async props(props) {
    this.proxiesData = await propsValidation.init(props, this.component.props, this.context, this.app) || {}
  }
  actives(nodeElement, ref, value) {
    const reactivity = (c) => {
      active(c.reactivity?.node, ref)
      active(c.reactivity?.component, ref, value)
    }
    const spotsReactivity = (c) => {
      for (const name in c.spot) {
        reactivity(c.spot[name])
        spotsReactivity(c.spot[name])
      }
    }
    reactivity(nodeElement)
    if (nodeElement.children) {
      nodeElement.children.forEach(c => spotsReactivity(c))
    } else spotsReactivity(nodeElement)
  }
  destroy(container) {
    container.reactivity?.component?.clear()
    container.prop = {}
    container.action = {}
    for (const key in container.unstore) {
      container.unstore[key]()
    }
  }
  refresh(v) {
    if (this.context.node) {
      for (const node of Object.values(this.context.node)) {
        if (!node.unmount) continue
        for (const key in node.spot) {
          node.spot[key].refresh?.(v)
        }
        node.refresh(v)
      }
    }
    super.refreshed(v)
  }
  unmount(container) {
    if (this.context.node) {
      for (const node of Object.values(this.context.node)) {
        if (node.directives) {
          for (const directive of Object.values(node.directives)) {
            directive.destroy?.()
          }
        }
        node.reactivity?.node?.clear()
        if (!node.unmount) continue
        for (const key in node.spot) {
          node.spot[key].unmount?.()
        }
        node.unmount()
      }
    }
    const { spotname, parent } = container
    if (spotname) parent.refresh({ cause: 'spotUnmounted', data: { spotname }})
    super.unmounted(container)
  }
}
export { InitNodeComponent }