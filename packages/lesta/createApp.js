import { mount } from './mount'

function createApp(app = {}) {
  app.id = 0
  app.name ||= '_'
  app.mount = async (container, propsData) => {
    const { options, target } = container
    return await mount(options, { target, nodepath: app.name, action: {}, prop: {} }, propsData, app)
  }
  Object.assign(app, { router: {}, store: {} })
  Object.preventExtensions(app)
  return app
}
export { createApp }