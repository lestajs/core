import renderComponent from './renderComponent'
import { lifecycle } from '../lifecycle'
import { Init } from '../../init'
import Nodes from '../../nodes'

function createApp(entry) {
  entry.plugins = {
    ...entry.plugins,
    get isBrowser() {
      return typeof window !== 'undefined' && typeof document !== 'undefined'
    }
  }
  const app = {
    ...entry,
    async mount(options, nodeElement, props = {}) {
      if (options) {
        const component = new Init(options, app, Nodes)
        app.update = (args) => component.context.options.updated.bind(component.context)(args)
        const hasHTML = app.plugins.router?.to.route.static
        const container = renderComponent({...options}, nodeElement || app.root, component, props.section, hasHTML)
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