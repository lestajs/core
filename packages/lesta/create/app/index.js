import { lifecycle } from '../lifecycle'
import plugins from '../plugins'
import renderComponent from './renderComponent'
import { Init } from '../../init'
import Nodes from '../../nodes'
import { loadModule } from '../../../utils'
import { errorComponent } from '../../../utils/errors/component'

function createApp(entry) {
  entry.plugins = { ...entry.plugins, plugins }
  const app = {
    ...entry,
    async mount(src, signal, aborted, nodeElement, props = {}) {
      nodeElement = nodeElement || app.root
      const nodepath = nodeElement.nodepath || 'root'
      if (signal && !(signal instanceof AbortSignal)) errorComponent(nodepath, 217)
      if (aborted && !(typeof aborted !== 'function')) errorComponent(nodepath, 218)
      const options = await loadModule(src, signal)
      if (!options) return errorComponent(nodepath, 216)
      const component = new Init(options, app, signal, Nodes)
      const hasHTML = app.plugins.router?.to.route.static
      const render = () => renderComponent(nodeElement, component, props, hasHTML)
      return await lifecycle(nodeElement, component, render, aborted, props)
    },
    async unmount() {
      await app.root.unmount()
    }
  }
  return app
}
export { createApp }