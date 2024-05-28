import { mount } from './mount'

function createApp(app = {}) {
  const container = {}
  app.mount = async ({ options, target, name = 'root', props = {} }) => {
    Object.assign(container, { target, nodepath: name })
    return await mount(options , { target, nodepath: name }, props, app)
  }
  app.unmount = () => container.unmount?.()
  Object.preventExtensions(app)
  return app
}
export { createApp }