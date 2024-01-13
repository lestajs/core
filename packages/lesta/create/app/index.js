import { mount } from '../mount'

function createApp(app = {}) {
  app.use = (plugin, options) => plugin.setup(app, options)
  app.mount = async (component, container, props) => await mount(app, component, container, props)
  return app
}
export { createApp }