import { mount } from '../mount'

function createApp(app = {}) {
  app.use = (plugin, options) => plugin.setup(app, options),
  app.mount = async (options, root) => await mount(app, root, options)
  return app
}
export { createApp }