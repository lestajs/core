import { errorComponent } from '../utils/errors/component'
import { cleanHTML } from '../utils'

export default function renderComponent(nodeElement, component, controller) {
  const options = { ...component.context.options }
  if (!options.template) return errorComponent(nodeElement.nodepath, 209)
  const getContent = (template) => {
    const html = typeof template === 'function' ? template.bind(component.context)() : template
    const content = cleanHTML(html.trim())
    if ((nodeElement.isIterable || nodeElement.prepared) && content.length > 1) return errorComponent(nodeElement.nodepath, 210)
    return content
  }
  const spots = (node) => {
    if (options.spots?.length) node.spot = {}
    options.spots?.forEach(name => Object.assign(node.spot, { [name]: { target: node.target.querySelector(`[spot="${ name }"]`) }}))
  }
  if (nodeElement.isIterable) {
    const parent = nodeElement.parent
    if (parent.children.length === 1 && parent.target.childNodes.length) parent.target.innerHTML = ''
    const content = getContent(options.template)
    parent.target.append(...content)
    nodeElement.target = parent.target.lastChild
    spots(nodeElement)
    if (!parent.unmount) parent.unmount = () => {
      component.destroy(parent)
      parent.clear()
      delete parent.unmount
    }
    nodeElement.unmount = () => {
      component.destroy(nodeElement) // for store
      component.unmount(nodeElement)
      controller.abort() // !
    }
  } else {
    if (nodeElement.prepared) {
      const content = getContent(options.template)
      const target = nodeElement.target
      nodeElement.target.before(...content)
      nodeElement.target = target.previousSibling
      target.remove()
    } else {
      const content = getContent(options.template)
      nodeElement.target.innerHTML = ''
      content && nodeElement.target.append(...content)
    }
    spots(nodeElement)
    nodeElement.unmount = () => {
      component.destroy(nodeElement)
      component.unmount(nodeElement)
      nodeElement.target.innerHTML = ''
      controller.abort()
    }
  }
}