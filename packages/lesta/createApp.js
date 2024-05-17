import { mount } from './mount'

function createApp(app = {}) {
  app.store = {}
  app.stores = {}
  app.mount = async ({ options, target, name = 'root', aborted, completed }) => {
    return await mount(options , { target, nodepath: name }, { aborted, completed }, app)
  }
  Object.preventExtensions(app)
  return app
}
export { createApp }