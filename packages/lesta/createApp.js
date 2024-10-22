import { mount } from './mount'

function createApp(app = {}) {
  const container = {}
  app.mount = async ({ options, target, name = 'root' }, propsData = {}) => {
    Object.assign(container, { target, nodepath: name })
    return await mount(options , { target, nodepath: name }, propsData, app)
  }
  app.unmount = () => container.unmount?.()
  Object.preventExtensions(app)
  return app
}
export { createApp }