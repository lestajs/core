import Node from '../node.js'
import props from '../../nodes/component/props'
import sections from './sections/index.js'
import { errorComponent } from '../../../utils/errors/component'

export default class Components extends Node {
  constructor(...args) {
    super(...args)
    this.nodeElement.reactivity.component = new Map()
  }
  reactiveComponent(refs, active, target) {
    const nodeElement = target || this.nodeElement
    this.reactive(refs, active, nodeElement.reactivity.component)
  }
  reactivate(proxies, reactive, arr, index, target) {
    const result = {}
    if (proxies) {
      for (const [pr, fn] of Object.entries(proxies)) {
        if (typeof fn === 'function' && fn.name) {
          this.impress.collect = true
          const value = (arr && fn.length) ? fn(arr[index], index) : fn(target)
          Object.assign(result, {[pr]: value})
          reactive(pr, fn)
          this.impress.clear()
        } else Object.assign(result, {[pr]: fn})
      }
    }
    return result
  }
  async create(specialty, nodeElement, propertyComponent, proxies, value, index) {
    if (!propertyComponent.src) return errorComponent(nodeElement.nodepath, 203)
    const container = await this.app.mount(propertyComponent.src, propertyComponent.abortSignal, propertyComponent.aborted, nodeElement, props.collect(propertyComponent, proxies, value, index))
    if (!container) return
    sections(propertyComponent, specialty, container, (proxies, target, section) => {
      if (index !== undefined) {
        return specialty(proxies, container.section[section], index)
      } else {
        return specialty(proxies, target)
      }
    }, this.create.bind(this))
  }
}