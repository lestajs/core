import { errorComponent } from '../../../utils/errors/component'
import { stringToHTML } from '../../../utils'

export default function renderComponent(nodeElement, component, props, hasHTML) {
  const options = { ...component.context.options }
  if (props.section) {
    const section = props.section
    const sectionNode = nodeElement.section[section]
    if (!sectionNode) return errorComponent(nodeElement.nodename, 202, section)
    if (!hasHTML) sectionNode.innerHTML = options.template
    sectionNode.nodepath = nodeElement.nodepath + '.' + section
    sectionNode.nodename = section
    sectionNode.unmount = async () => {
      component.destroy(sectionNode)
      await component.unmount()
      sectionNode.innerHTML = ''
    }
    return sectionNode
  } else {
    if (nodeElement.hasAttribute('iterate')) {
      if (!nodeElement.iterableElement) {
        if (!options.template) return errorComponent(nodeElement.nodepath, 209)
        const template = stringToHTML(options.template)
        if (template.children.length > 1) return errorComponent(nodeElement.nodepath, 210)
        nodeElement.iterableElement = template.children[0]
        nodeElement.innerHTML = ''
      }
      if (!hasHTML) nodeElement.insertAdjacentElement('beforeEnd', nodeElement.iterableElement.cloneNode(true))
      const iterableElement = nodeElement.children[nodeElement.children.length - 1]
      iterableElement.nodepath = nodeElement.nodepath
      if (!nodeElement.unmount) nodeElement.unmount = async () => {
        component.destroy(nodeElement)
        await nodeElement.removeAll()
      }
      iterableElement.setAttribute('iterable', '')
      iterableElement.unmount = async () => {
        component.destroy(iterableElement)
        await component.unmount()
        iterableElement.remove()
      }
      return iterableElement
    } else if (options.template && !hasHTML) {
      nodeElement.innerHTML = options.template
    }
    nodeElement.unmount = async () => {
      component.destroy(nodeElement)
      await component.unmount()
      nodeElement.innerHTML = ''
    }
    return nodeElement
  }
}