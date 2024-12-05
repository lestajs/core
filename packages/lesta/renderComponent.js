import { errorComponent } from '../utils/errors/component'
import { cleanHTML } from '../utils'

export default function renderComponent(nodeElement, component) {
  const options = { ...component.context.options }
  const getContent = (template) => {
    const html = typeof template === 'function' ? template.bind(component.context)() : template
    return cleanHTML(html)
  }
  const checkContent = (template) => { // only iterated and replaced
    if (!template) return errorComponent(nodeElement.nodepath, 210)
    const content = getContent(template)
    if (content.length > 1) return errorComponent(nodeElement.nodepath, 210)
    return content
  }
  const spots = (node) => {
    if (options.spots?.length) node.spot = {}
    options.spots?.forEach(name => Object.assign(node.spot, { [name]: { target: node.target.querySelector(`[spot="${ name }"]`) }}))
  }
  if (nodeElement.iterated) {
    const parent = nodeElement.parent
    if (parent.children.length === 1 && parent.target.childNodes.length) parent.target.innerHTML = ''
    const content = checkContent(options.template)
    parent.target.append(...content)
    nodeElement.target = parent.target.lastChild
    spots(nodeElement)
    if (!parent.unmount) parent.unmount = () => {
      component.destroy(parent)
      parent.clear()
    }
    nodeElement.unmount = () => {
      component.destroy(nodeElement) // for store
      component.unmount(nodeElement)
      component.context.abort()
    }
  } else {
    if (nodeElement.replaced) {
      const content = checkContent(options.template)
      const target = nodeElement.target
      nodeElement.target.before(...content)
      nodeElement.target = target.previousSibling
      target.remove()
    } else {
      if (!options.template) return
      const content = getContent(options.template)
      nodeElement.target.innerHTML = ''
      nodeElement.target.append(...content)
    }
    spots(nodeElement)
    nodeElement.unmount = () => {
      component.destroy(nodeElement)
      component.unmount(nodeElement)
      nodeElement.target.innerHTML = ''
      component.context.abort()
    }
  }
}