import { mount } from './mount'

/**
 * @typedef {Object} App
 * @property {string} name
 * @property {Function} mount
 */

/**
 * @param {Partial<App>} [app]
 * @returns {Readonly<App>}
 */

function createApp(app = {}) {
  app.id = 0
  app.name ||= '_'
  app.mount = async (options, target, propsData) => await mount(options, { target, nodepath: app.name, action: {}, prop: {} }, propsData, app)
  Object.assign(app, { router: {}, store: {} })
  Object.preventExtensions(app)
  return app
}
export { createApp }