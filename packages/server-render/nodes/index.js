import optionsComponent from '../../lesta/nodes/component/optionsComponent.js'
import renderComponent from '../renderComponent.js'

export default {
  component: async (node, nodeElement, app) => {
    const create = async (component, val, index) => {
      if (!component.src) return ''
      const proxies = optionsComponent.params(component.proxies, val, index)
      const { options, props } = await optionsComponent.collect(component, proxies, val, index)
      let  html = await renderComponent(app, options, nodeElement, props)
      if (component.sections) {
        
        for await (const [section, sectionOptions] of Object.entries(component.sections)) {
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