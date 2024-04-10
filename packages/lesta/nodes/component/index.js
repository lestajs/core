import Node from '../node.js'
import props from '../../nodes/component/props'
import sectionComponent from './sections/index.js'
import { errorComponent } from '../../../utils/errors/component'
import { mountComponent } from '../../mountComponent'

export default class Components extends Node {
  constructor(...args) {
    super(...args)
    this.nodeElement.reactivity.component = new Map()
  }
  reactiveComponent(refs, active, target) {
    const nodeElement = target || this.nodeElement
    return this.reactive(refs, active, nodeElement.reactivity.component)
  }
  reactivate(proxies, reactive, arr, index, target) {
    const result = {}
    if (proxies) {
      for (const [pr, v] of Object.entries(proxies)) {
        if (typeof v === 'function' && v.name) {
          this.impress.collect = true
          const value = arr && v.length ? v(arr[index], index) : v(target)
          const ref = reactive(pr, v)
          Object.assign(result, { [pr]: { _value: value, _independent: !ref } })
          // this.impress.clear()
        } else Object.assign(result, { [pr]: { _value: v, _independent: true } })
      }
    }
    return result
  }
  async create(specialty, nodeElement, pc, proxies, value, index) {
    const { src, abortSignal, aborted, sections, ssr } = pc
    if (!src) return errorComponent(nodeElement.nodepath, 203)
    let container = null
    if (!nodeElement.process) {
      nodeElement.process = true
      container = await mountComponent(src, nodeElement, {
        abortSignal,
        aborted,
        sections,
        ssr,
        ...props.collect(pc, value, index),
        proxies: proxies() || {}
      }, this.app)
      delete nodeElement.process
    }
    if (!container) return
    await sectionComponent(pc, specialty, container, (proxies, target, section) => {
        if (index !== undefined) {
          return specialty(proxies, container.section[section], index)
        } else {
          return specialty(proxies, target)
        }
      }, this.create.bind(this))
  }
}