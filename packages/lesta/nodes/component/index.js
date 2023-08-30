import Node from '../node.js'
import optionsComponent from './optionsComponent.js'
import sections from './sections/index.js'
import { errorComponent } from '../../../utils/errors/component.js'

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
  async create(specialty, nodeElement, component, proxies, value, index) {
    if (!component.src) return errorComponent(nodeElement.nodepath, 203)
    const { options, props } = await optionsComponent.collect(component, proxies, value, index)
    const result = await this.app.mount(options, nodeElement, props)
    await sections(component, specialty, result?.container, (proxies, target, section) => {
      if (index !== undefined) {
        return specialty(proxies, result?.container.section[section], index)
      } else { return specialty(proxies, target) }
    }, this.create.bind(this))
  }
}