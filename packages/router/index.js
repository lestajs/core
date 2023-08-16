import { RouterBasic, Router } from './init/index.js'

function createRouter(options) {
  return {
    init: (app) => {
      if (app.ssr) {
        const router = new RouterBasic(options)
        router.initBasic(app)
      } else {
        const router = new Router(options)
        router.init(app)
      }
    }
  }
}

export { createRouter }