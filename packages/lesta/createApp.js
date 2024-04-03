import { mountComponent } from './mountComponent'

function createApp(app = {}) {
  app.use = (plugin, options) => plugin.setup(app, options)
  app.mount = async (component, container, props) => await mountComponent(component, container, props, app)
  return app
}
export { createApp }