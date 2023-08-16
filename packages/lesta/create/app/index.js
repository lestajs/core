import createComponent from './createComponent'
import { lifecycle } from '../lifecycle'
import { Init } from '../../init'
import Nodes from '../../nodes'

function createApp(entry) {
  entry.plugins = entry.plugins || {}
  const app = {
    ...entry,
    async mount(options, nodeElement, props = {}) {
      if (options) {
        const component = new Init(options, app, Nodes)
        const container = createComponent({...options}, nodeElement || app.root, component, props.section, app.plugins.router?.static)
        await lifecycle(component, container, props)
        return { options, context: component.context, container }
      }
    },
    async unmount() {
      await app.root.unmount()
    }
  }
  return app
}
export { createApp }