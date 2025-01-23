import { mount } from './mount'

function createApp(app = {}) {
  app.mount = async (container, propsData) => {
    const { options, target, name = 'root' } = container
    return await mount(options, { target, nodepath: name, action: {}, prop: {} }, propsData, app)
  }
  Object.assign(app, { router: {}, store: {} })
  Object.preventExtensions(app)
  return app
}
export { createApp }