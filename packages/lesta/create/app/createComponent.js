import { errorComponent } from '../../../utils/errors/component'
import { stringToHTML } from '../../../utils'

export default function createComponent(options, nodeElement, component, section, isStatic) {
  if (section) {
    const sectionNode = nodeElement.section[section]
    if (!sectionNode) return errorComponent(nodeElement.nodename, 202, section)
    if (!isStatic) sectionNode.innerHTML = options.template
    sectionNode.nodepath = nodeElement.nodepath + '.' + section
    sectionNode.nodename = section
    if (!sectionNode.unmount) sectionNode.unmount = async () => {
      component.destroy(sectionNode)
      sectionNode.innerHTML = ''
      await component.unmount()
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
      if (!isStatic) nodeElement.insertAdjacentElement('beforeEnd', nodeElement.iterableElement.cloneNode(true))
      const iterableElement = nodeElement.children[nodeElement.children.length - 1]
      iterableElement.nodepath = nodeElement.nodepath
      if (!nodeElement.unmount) nodeElement.unmount = async () => {
        component.destroy(nodeElement)
        for await (const child of nodeElement.children) {
          await child.unmount()
        }
      }
      iterableElement.setAttribute('iterable', '')
      iterableElement.unmount = async () => {
        component.destroy(iterableElement)
        iterableElement.remove()
        await component.unmount()
      }
      return iterableElement
    } else if (options.template && !isStatic) {
      nodeElement.innerHTML = options.template
    }
    if (!nodeElement.unmount) nodeElement.unmount = async () => {
      component.destroy(nodeElement)
      nodeElement.innerHTML = ''
      await component.unmount()
    }
    return nodeElement
  }
}