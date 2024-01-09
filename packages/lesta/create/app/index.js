import { createStores } from '../../store'
import { mount } from '../mount'

function createApp(app = {}) {
  app.initPlugin = (plugin, options) => plugin.install(app, options),
  app.root.mount = (pc) => mount(app, app.root, pc)
  createStores(app)
  return app
}
export { createApp }