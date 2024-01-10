import { errorComponent } from '../../../../utils/errors/component'

export default async function(pc, specialty, nodeElement, proxies, create) {
  if (pc.sections) {
    const mount = async (section, options) => {
      if (pc.iterate) return errorComponent(nodeElement.section[section].nodepath, 204)
      nodeElement.section[section].unmount?.()
      if (options.src) {
        options.section = section
        await create(specialty, nodeElement, options, proxies(options.proxies, nodeElement.section[section], section))
      }
    }
    nodeElement.section = {}
    for await (const [section, options] of Object.entries(pc.sections)) {
      if (options.induce || options.iterate) return errorComponent(nodeElement.section[section].nodepath, 215)
      const sectionNode = nodeElement.querySelector(`[section="${section}"]`)
      if (!sectionNode) return errorComponent(nodeElement.nodepath, 201, section)
      if (!sectionNode.reactivity) sectionNode.reactivity = { component: new Map() }
      Object.assign(nodeElement.section, {[section]: sectionNode})
      if (options.src) await mount(section, options)
      sectionNode.mount = async (v) => await mount(section, v || options)
    }
  }
}