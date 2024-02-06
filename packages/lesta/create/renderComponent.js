import { errorComponent } from '../../utils/errors/component'
import { stringToHTML } from '../../utils'

export default function renderComponent(nodeElement, component, section, ssr) {
  const options = { ...component.context.options }
  if (section) {
    const sectionNode = nodeElement.section[section]
    if (!sectionNode) return errorComponent(nodeElement.nodename, 202, section)
    if (!ssr) sectionNode.innerHTML = options.template
    sectionNode.nodepath = nodeElement.nodepath + '.' + section
    sectionNode.nodename = section
    sectionNode.unmount = () => {
      component.destroy(sectionNode)
      component.unmount(sectionNode)
      sectionNode.innerHTML = ''
    }
    return sectionNode
  } else {
    if (nodeElement.hasAttribute('iterate')) {
      if (!options.template) return errorComponent(nodeElement.nodepath, 209)
      if (!ssr) nodeElement.insertAdjacentHTML("beforeEnd", options.template)
      const iterableElement = nodeElement.children[nodeElement.children.length - 1]
      //  if (nodeElement.children.length > 1) return errorComponent(nodeElement.nodepath, 210)
      iterableElement.nodepath = nodeElement.nodepath
      if (!nodeElement.unmount) nodeElement.unmount = () => {
        component.destroy(nodeElement)
        nodeElement.removeChildren()
        delete nodeElement.unmount
      }
      iterableElement.setAttribute('iterable', '')
      iterableElement.unmount = async () => {
        component.destroy(iterableElement)
        component.unmount(iterableElement)
        iterableElement.remove()
      }
      return iterableElement
    } else if (options.template && !ssr) {
      nodeElement.innerHTML = options.template
    }
    nodeElement.unmount = () => {
      component.destroy(nodeElement)
      component.unmount(nodeElement)
      nodeElement.innerHTML = ''
    }
    return nodeElement
  }
}