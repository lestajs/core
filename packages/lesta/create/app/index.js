import { mount } from '../mount'

function createApp(app = {}) {
  app.use = (plugin, options) => plugin.setup(app, options),
  app.mount = async (component, root, props) => await mount(app, component, root, props)
  return app
}
export { createApp }