import { errorComponent } from '../../../../utils/errors/component'

export default function(propertyComponent, specialty, nodeElement, proxies, create) {
  if (propertyComponent.sections) {
    const mount = async (section, options) => {
      if (propertyComponent.iterate) return errorComponent(nodeElement.section[section].nodepath, 204)
      if (nodeElement.section[section].unmount) await nodeElement.section[section].unmount()
      if (options.src) {
        options.section = section
        await create(specialty, nodeElement, options, proxies(options.proxies, nodeElement.section[section], section))
      }
    }
    nodeElement.section = {}
    for (const [section, options] of Object.entries(propertyComponent.sections)) {
      if (options.induce || options.iterate) return errorComponent(nodeElement.section[section].nodepath, 215)
      const sectionNode = nodeElement.querySelector(`[section="${section}"]`)
      if (!sectionNode) return errorComponent(nodeElement.nodepath, 201, section)
      if (!sectionNode.reactivity) sectionNode.reactivity = { component: new Map() }
      Object.assign(nodeElement.section, {[section]: sectionNode})
      if (options.src) mount(section, options)
      sectionNode.mount = async (v) => await mount(section, v || options)
    }
  }
}