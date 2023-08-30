import { errorComponent } from '../../../../utils/errors/component'

export default async function(component, specialty, nodeElement, proxies, create) {
  if (component.sections) {
    const mount = async (section, options) => {
      if (component.iterate) return errorComponent(nodeElement.section[section].nodepath, 204)
      if (nodeElement.section[section].unmount) await nodeElement.section[section].unmount()
      if (options.src) {
        options.section = section
        await create(specialty, nodeElement, options, proxies(options.proxies, nodeElement.section[section], section))
      }
    }
    nodeElement.section = {}
    for await (const [section, options] of Object.entries(component.sections)) {
      if (options.induce || options.iterate) return errorComponent(nodeElement.section[section].nodepath, 215)
      const sectionNode = nodeElement.querySelector(`[section="${section}"]`)
      if (!sectionNode) return errorComponent(nodeElement.nodepath, 201, section)
      if (!sectionNode.reactivity) sectionNode.reactivity = { component: new Map() }
      Object.assign(nodeElement.section, {[section]: sectionNode})
      if (options.src) await mount(section, options)
      sectionNode.mount = (v) => mount(section, v || options)
    }
  }
}