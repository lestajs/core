import { errorComponent } from '../utils/errors/component'
import templateToHTML from './templateToHTML'

export default function renderComponent(nodeElement, component) {
  const options = { ...component.context.options }
  const template = options.template
  const checkContent = (t) => { // only iterated and replaced
    const content = templateToHTML(t, component.context)
    if (content.length > 1) return errorComponent(nodeElement.nodepath, 210)
    return content
  }
  const spots = (node) => {
    if (options.spots?.length) node.spot = {}
    options.spots?.forEach(name => Object.assign(node.spot, { [name]: { target: node.target.querySelector(`[spot="${ name }"]`) }}))
  }
  if (nodeElement.iterated) {
    const parent = nodeElement.parent
    // if (parent.children.length === 1 && parent.target.childNodes.length) parent.target.innerHTML = ''
    if (template) {
      const content = checkContent(template)
      parent.target.append(...content)
    }
    nodeElement.target = parent.target.children[nodeElement.index]
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
      const content = checkContent(template)
      const target = nodeElement.target
      nodeElement.target.before(...content)
      nodeElement.target = target.previousSibling
      target.remove()
    } else {
      if (!template) return
      const content = templateToHTML(options.template, component.context)
      // nodeElement.target.innerHTML = ''
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