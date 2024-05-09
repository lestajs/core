import { errorComponent } from '../utils/errors/component'

export default function renderComponent(nodeElement, component, controller) { // - ssr
  const options = { ...component.context.options }
  if (!options.template) return errorComponent(nodeElement.nodepath, 209)
  const getTemplate = (template) => typeof template === 'function' ? template.bind(component.context)() : template
  const spots = (node) => {
    if (options.spots?.length) node.spot = {} // !
    options.spots?.forEach(name => Object.assign(node.spot, { [name]: { target: node.target.querySelector(`[spot="${ name }"]`) }})) // !
  }
  if (nodeElement.isIterable) {
    const parent = nodeElement.parent
    if (parent.children.length === 1 && parent.target.childNodes.length) parent.target.innerHTML = ''
    parent.target.insertAdjacentHTML('beforeEnd', getTemplate(options.template))
    nodeElement.target = parent.target.children[nodeElement.index]
    spots(nodeElement)
    if (!parent.unmount) parent.unmount = () => {
      component.destroy(parent)
      parent.clear()
      delete parent.unmount // ?
      // controller.abort()
    }
    nodeElement.unmount = () => { // ! - async
      component.destroy(nodeElement) // for store
      component.unmount(nodeElement)
      controller.abort() // !
    }
  } else { // ! - ssr
    nodeElement.target.innerHTML = getTemplate(options.template); // !
    spots(nodeElement)
    nodeElement.unmount = () => { // !
      component.destroy(nodeElement)
      component.unmount(nodeElement)
      nodeElement.target.innerHTML = ''// !
      controller.abort() // !
    }
  }
}