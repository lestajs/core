import { mount } from './mount'

function createApp(app = {}) {
  const container = {}
  app.mount = async ({ options, target, name = 'root' }, propsData) => {
    Object.assign(container, { target, nodepath: name, action: {}, prop: {} })
    return await mount(options, container, propsData, app)
  }
  app.unmount = () => container.unmount?.()
  Object.preventExtensions(app)
  return app
}
export { createApp }