import { mount } from './mount'

function createApp(app = {}) {
  app.mount = async ({ options, target, name = 'root', aborted, completed }) => {
    const container = { target, nodepath: name }
    await mount(options , container, { aborted, completed }, app)
    return container
  } // !
  Object.preventExtensions(app) // !
  return app
}
export { createApp }