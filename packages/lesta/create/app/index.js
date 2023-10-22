import { lifecycle } from '../lifecycle'
import { createStores } from '../../store'
import basicPlugins from '../plugins'
import { mixins } from '../mixins'
import renderComponent from './renderComponent'
import { Init } from '../../init'
import Nodes from '../../nodes'
import { loadModule } from '../../../utils'
import { errorComponent } from '../../../utils/errors/component'

function createApp(entry) {
  const { root, plugins = {}, directives = {} } = entry
  Object.assign(plugins, basicPlugins)
  const app = {
    root,
    plugins,
    directives,
    async mount(src, signal, aborted, nodeElement, props = {}) {
      nodeElement = nodeElement || app.root
      const nodepath = nodeElement.nodepath || 'root'
      if (signal && !(signal instanceof AbortSignal)) errorComponent(nodepath, 217)
      if (aborted && typeof aborted !== 'function') errorComponent(nodepath, 218)
      const options = await loadModule(src, signal)
      if (!options) return errorComponent(nodepath, 216)
      const component = new Init(mixins(options), app, signal, Nodes)
      const hasHTML = app.plugins.router?.to.route.static
      const render = () => renderComponent(nodeElement, component, props, hasHTML)
      return await lifecycle(component, render, aborted, props)
    },
    async unmount() {
      await app.root.unmount()
    }
  }
  if (entry.stores) {
    const stores = createStores(entry.stores)
    stores.init(app)
  }
  return app
}
export { createApp }