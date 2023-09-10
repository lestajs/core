import renderComponent from './renderComponent'
import { lifecycle } from '../lifecycle'
import { Init } from '../../init'
import Nodes from '../../nodes'
import plugins from '../plugins'

function createApp(entry) {
  entry.plugins = { ...entry.plugins, plugins }
  const app = {
    ...entry,
    async mount(options, nodeElement, props = {}) {
      if (options) {
        const component = new Init(options, app, Nodes)
        app.update = (args) => component.context.options.updated.bind(component.context)(args)
        const hasHTML = app.plugins.router?.to.route.static
        const container = renderComponent({...options}, nodeElement || app.root, component, props.section, hasHTML)
        return await lifecycle(component, container, props)
      }
    },
    async unmount() {
      await app.root.unmount()
    }
  }
  return app
}
export { createApp }