import props from '../../lesta/props.js'
import renderComponent from '../renderComponent.js'
import { errorComponent } from '../../utils/errors/component.js'

export default {
  component: async (node, nodeElement, app) => {
    const create = async (propertyComponent, val, index) => {
      if (!propertyComponent.src) return errorComponent(nodeElement.nodepath, 203)
      let html = await renderComponent(propertyComponent.src, app, nodeElement, props.collect(propertyComponent, props.params(propertyComponent.proxies, val, index), val, index))
      if (!html) return
      if (propertyComponent.sections) {
        for await (const [section, sectionOptions] of Object.entries(propertyComponent.sections)) {
          sectionOptions.section = section
          const sectionHTML = await create(sectionOptions, val, index)
          html = html.replace(`<!--section:${section}-->`, sectionHTML)
        }
      }
      return html
    }
    if (node.component.iterate) { // iterate
      if (typeof node.component.iterate === 'function') {
        let html = ''
        const data = node.component.iterate()
        if (data) {
          let i = 0
          for await (let val of data) {
            html += await create(node.component, data[i], i)
            i++
          }
        }
        return html
      }
    } else if (node.component.induce) { // induce
      if (typeof node.component.induce === 'function') {
        const permit = node.component.induce()
        return permit ? await create(node.component) : ''
      }
    } else {
      return await create(node.component)
    }
  },
  html: async (node, nodeElement) => {
    const value = node._html
    return typeof value === 'function' ? await value(nodeElement) : value
  },
  text: async (node, nodeElement) => {
    const value = node._text
    const text = typeof value === 'function' ? await value(nodeElement) : value
    return text?.toString().replace(/</g, "&lt;") || ''
  }
}