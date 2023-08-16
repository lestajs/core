import Node from '../node.js'
import optionsComponent from './optionsComponent.js'
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
  async section(specialty, nodeElement, proxies) {
    const integrate = async (section, options) => {
      nodeElement.setAttribute('integrate', '')
      if (nodeElement.section[section].unmount) await this.nodeElement.section[section].unmount()
      options.section = section
      await this.create(specialty, nodeElement, options, proxies(options.proxies, nodeElement.section[options.section], options.section))
    }
    nodeElement.section = {}
    if (this.node.component.sections) {
      for await (const [section, options] of Object.entries(this.node.component.sections)) {
        const sectionNode = nodeElement.querySelector(`[section="${section}"]`)
        if (!sectionNode) return errorComponent(nodeElement.nodepath, 201, section)
        if (!sectionNode.reactivity) sectionNode.reactivity = {component: new Map()}
        Object.assign(nodeElement.section, {[section]: sectionNode})
        if (options.src) {
          await integrate(section, options)
        } else if (this.node.component.iterate) return errorComponent(sectionNode.nodepath, 204)
        nodeElement.integrate = integrate
      }
    }
  }
  async create(specialty, nodeElement, component, proxies, value, index) {
    if (!component.src) return errorComponent(nodeElement.nodepath, 203)
    const { options, props } = await optionsComponent.collect(component, proxies, value, index)
    const result = await this.app.mount(options, nodeElement, props)
    if (component.sections) {
      await this.section(specialty, result?.container, (proxies, target, section) => {
        if (index !== undefined) {
          return specialty(proxies, result?.container.section[section], index)
        } else { return specialty(proxies, target) }
      })
    }
  }
}